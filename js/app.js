let editor;
let currentModule = 0;
let currentSection = 0;

// OpenRouter API Configuration
const API_KEY_INJECTED = "__GEMINI_API_KEY__";
let OPENROUTER_API_KEY = API_KEY_INJECTED.startsWith("__") ? localStorage.getItem("openrouter_api_key") || "" : API_KEY_INJECTED;

async function initializeApp() {
    const editorEl = document.getElementById("editor");
    if (!editorEl) return;

    editor = CodeMirror.fromTextArea(editorEl, {
        mode: "shell",
        theme: "material-darker",
        lineNumbers: true
    });

    loadModules();
}

function loadModules() {
    const moduleSelect = document.getElementById("moduleSelect");
    moduleSelect.innerHTML = "";

    courseData.modules.forEach((module, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = module.title;
        moduleSelect.appendChild(option);
    });

    moduleSelect.value = currentModule;
    moduleSelect.onchange = function () {
        currentModule = parseInt(this.value);
        currentSection = 0;
        loadSections();
    };

    loadSections();
}

function loadSections() {
    const sectionSelect = document.getElementById("sectionSelect");
    sectionSelect.innerHTML = "";

    const sections = courseData.modules[currentModule].sections;
    sections.forEach((section, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = section.title;
        sectionSelect.appendChild(option);
    });

    sectionSelect.value = currentSection;
    sectionSelect.onchange = function () {
        currentSection = parseInt(this.value);
        renderSection();
    };

    renderSection();
}

function renderSection() {
    const section = courseData.modules[currentModule].sections[currentSection];

    document.getElementById("moduleSelect").value = currentModule;
    document.getElementById("sectionSelect").value = currentSection;

    let content = section.brief || section.description;
    content = content.replace(/<h4>.*?<\/h4>/, "");
    document.getElementById("description").innerHTML = content;
    document.getElementById("sectionHeading").textContent = section.title;

    initReveal();

    document.getElementById("syntax").textContent = section.syntax;
    updateDiagram(section);
    renderTabs(section, 0);

    if (section.examples.length > 0) {
        editor.setValue(section.examples[0].code);
    } else {
        editor.setValue("# No examples available");
    }

    // Hide/show right panel toggle based on section
    const toggleBtn = document.getElementById('panelToggle');
    if (section.showEditor === false) {
        toggleBtn.style.display = 'none';
        // Auto-close panel if open
        const panel = document.getElementById('rightPanel');
        if (panel.classList.contains('open')) toggleRightPanel();
    } else {
        toggleBtn.style.display = 'block';
    }
}

function renderTabs(section, activeIndex) {
    const tabs = document.getElementById("exampleTabs");
    tabs.innerHTML = "";

    function setActiveTab(btn) {
        tabs.querySelectorAll(".example-btn").forEach(function(b) {
            b.classList.remove("active-tab");
        });
        btn.classList.add("active-tab");
    }

    const scratchButton = document.createElement("button");
    scratchButton.innerText = "\u270F Scratch Pad";
    scratchButton.className = "example-btn";
    scratchButton.onclick = function() {
        setActiveTab(scratchButton);
        editor.setValue(localStorage.getItem(section.id) || "# Scratch Pad - write your PowerShell here");
    };
    tabs.appendChild(scratchButton);

    section.examples.forEach(function(example, index) {
        const button = document.createElement("button");
        button.className = "example-btn";
        button.innerText = example.name;
        button.onclick = function() {
            setActiveTab(button);
            editor.setValue(example.code);
        };
        tabs.appendChild(button);

        if (index === activeIndex) {
            button.classList.add("active-tab");
        }
    });
}

function updateDiagram(section) {
    const container = document.querySelector(".diagram-box");

    if (section.diagram) {
        container.innerHTML = section.diagram;
        return;
    }

    const title = section.title;
    const id = section.id || "";
    const diagramType = sectionDiagramTypes[id] || "generic";

    const newBox = container.cloneNode(false);
    newBox.innerHTML = getDiagramSVG(diagramType, title);
    container.parentNode.replaceChild(newBox, container);
}

// === Collapsible Right Panel ===

function toggleRightPanel() {
    const panel = document.getElementById('rightPanel');
    const toggle = document.getElementById('panelToggle');
    const left = document.getElementById('leftPanel');

    panel.classList.toggle('open');
    toggle.classList.toggle('shifted');
    left.classList.toggle('shifted');

    if (panel.classList.contains('open')) {
        toggle.innerHTML = '\u25B6 Close';
    } else {
        toggle.innerHTML = '\u25C0 Code & AI';
    }

    // Refresh CodeMirror after transition
    setTimeout(function() { if (editor) editor.refresh(); }, 350);
}

// === Copy to Clipboard ===

function copyToClipboard() {
    const code = editor.getValue();
    navigator.clipboard.writeText(code).then(function() {
        document.getElementById('copyStatus').textContent = '\u2713 Copied!';
        setTimeout(function() { document.getElementById('copyStatus').textContent = ''; }, 2000);
    }).catch(function() {
        document.getElementById('copyStatus').textContent = '\u2717 Failed to copy';
        setTimeout(function() { document.getElementById('copyStatus').textContent = ''; }, 2000);
    });
}

// Legacy alias
function copyCode() { copyToClipboard(); }
function clearOutput() {}

// === Reveal System ===

let revealItems = [];
let revealIndex = 0;

function initReveal() {
    const desc = document.getElementById("description");
    revealItems = desc.querySelectorAll("li");
    revealIndex = 0;
    updateRevealCounter();
}

function revealNext() {
    if (revealIndex < revealItems.length) {
        revealItems[revealIndex].classList.add("revealed");
        revealIndex++;
        updateRevealCounter();
    }
}

function revealAll() {
    revealItems.forEach(function(item) { item.classList.add("revealed"); });
    revealIndex = revealItems.length;
    updateRevealCounter();
}

function updateRevealCounter() {
    const counter = document.getElementById("revealCount");
    if (counter) {
        if (revealItems.length === 0) {
            counter.textContent = "";
        } else {
            counter.textContent = revealIndex + " / " + revealItems.length;
        }
    }
}

// === Navigation ===

function previousSection() {
    if (currentSection > 0) {
        currentSection--;
    } else if (currentModule > 0) {
        currentModule--;
        currentSection = courseData.modules[currentModule].sections.length - 1;
        loadSections();
        return;
    }
    renderSection();
}

function nextSection() {
    if (revealIndex < revealItems.length) {
        revealNext();
        return;
    }

    const totalSections = courseData.modules[currentModule].sections.length;
    if (currentSection < totalSections - 1) {
        currentSection++;
    } else if (currentModule < courseData.modules.length - 1) {
        currentModule++;
        currentSection = 0;
        loadSections();
        return;
    }
    renderSection();
}

function toggleDescription() {
    document.querySelector(".left-panel").classList.toggle("fullscreen");
}

window.onload = initializeApp;

// ===== AI Chat Functions =====

function toggleChat() {
    const body = document.getElementById("chatBody");
    body.classList.toggle("open");
    const btn = document.querySelector(".chat-toggle");
    btn.textContent = body.classList.contains("open") ? "\u25B2" : "\u25BC";
}

function addChatMessage(text, role) {
    const messages = document.getElementById("chatMessages");
    const msg = document.createElement("div");
    msg.className = "chat-msg " + role;
    msg.innerHTML = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
}

async function sendChat() {
    const input = document.getElementById("chatInput");
    const question = input.value.trim();
    if (!question) return;

    input.value = "";
    addChatMessage(question, "user");

    if (!OPENROUTER_API_KEY) {
        const key = prompt("Enter the AI API key (provided by your instructor):");
        if (key && key.trim()) {
            OPENROUTER_API_KEY = key.trim();
            localStorage.setItem("openrouter_api_key", OPENROUTER_API_KEY);
        } else {
            addChatMessage("No API key provided. Ask your instructor for the key.", "bot");
            return;
        }
    }

    const loadingMsg = addChatMessage("Thinking...", "bot loading");

    const code = editor ? editor.getValue() : "";
    const section = courseData.modules[currentModule].sections[currentSection];

    const chatPrompt = "You are a helpful PowerShell tutor specializing in Jira automation. You ONLY answer questions related to PowerShell, Jira REST API, the code shown below, or the course topic. If the question is unrelated, politely decline.\n\nThe student is studying: \"" + section.title + "\"\n\nCode:\n```powershell\n" + code + "\n```\n\nQuestion: \"" + question + "\"\n\nGive a clear, helpful answer. Refer to specific lines if about the code. Keep it concise (4-6 sentences).";

    const models = [
        "openrouter/auto",
        "google/gemma-4-31b-it:free",
        "nvidia/nemotron-nano-9b-v2:free",
        "openai/gpt-oss-20b:free",
        "google/gemma-4-26b-a4b-it:free"
    ];

    let lastError = "";
    for (var i = 0; i < models.length; i++) {
        var model = models[i];
        try {
            var response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + OPENROUTER_API_KEY,
                    "HTTP-Referer": window.location.href,
                    "X-Title": "Automating Jira with PowerShell"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: chatPrompt }],
                    max_tokens: 1024,
                    temperature: 0.7
                })
            });

            var data = await response.json();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                var answer = data.choices[0].message.content || "";
                if (answer.trim()) {
                    loadingMsg.remove();
                    answer = answer
                        .replace(/\n\n/g, "<br><br>")
                        .replace(/\n/g, "<br>")
                        .replace(/`([^`]+)`/g, "<code>$1</code>")
                        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
                    addChatMessage(answer, "bot");
                    return;
                }
            }
            lastError = data.error ? data.error.message : "Empty response";
        } catch (err) {
            lastError = err.message;
        }
    }

    loadingMsg.remove();
    addChatMessage("All models busy. Please try again in a moment. (" + lastError + ")", "bot");
}

// Keyboard navigation
document.addEventListener("keydown", function(e) {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    if (e.target.classList.contains("CodeMirror")) return;
    if (document.querySelector(".CodeMirror-focused")) return;

    if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSection();
    } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        previousSection();
    }
});

