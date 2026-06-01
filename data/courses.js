var courseData = {
    title: "Automating Jira with PowerShell",
    modules: [
        {
            title: "Module 1: PowerShell Basics \u2014 Variables & Data Types",
            sections: [
                {
                    id: "m1s1",
                    title: "1.1 Variables & Strings",
                    showEditor: true,
                    brief: "<ul><li>Variables store data using the $ prefix</li><li>Strings use double quotes for interpolation</li><li>Single quotes are literal (no variable expansion)</li><li>String interpolation embeds variables inside double-quoted strings</li><li>Use variables to store server names, URLs, and configuration values</li></ul>",
                    description: "<h4>Variables & Strings</h4><p>In PowerShell, every variable starts with a <code>$</code> sign. You can store text, numbers, dates \u2014 anything. Double-quoted strings allow <strong>variable interpolation</strong> (the variable value gets inserted), while single-quoted strings are treated as literal text.</p><p><strong>Why this matters for Jira automation:</strong> You will store API URLs, project keys, and ticket data in variables throughout this course.</p>",
                    syntax: "$variableName = \"value\"\n\"String with $variable interpolation\"\n'Literal string - no interpolation'",
                    script: "Start simple. Show that $ is required for all variables. Demonstrate the difference between single and double quotes \u2014 this trips up beginners constantly. Use a Jira-relevant example like storing a server URL to foreshadow what is coming.\n\nTip: Ask students what they think $name will show inside single quotes before running it. The surprise helps it stick.",
                    examples: [
                        {
                            name: "Variables & Strings",
                            code: "# Variables in PowerShell always start with $\n$name = \"John\"\n$role = \"DBA\"\n$server = \"jira.company.com\"\n$project = \"KAN\"\n\n# Double quotes = variable interpolation (values inserted)\nWrite-Host \"Hello $name, you are a $role\"\nWrite-Host \"Jira server: $server\"\nWrite-Host \"Project key: $project\"\n\n# Single quotes = literal (no interpolation)\nWrite-Host 'Hello $name'   # Outputs: Hello $name\n\n# String concatenation with +\n$url = \"https://\" + $server + \"/rest/api/3\"\nWrite-Host \"API URL: $url\"\n\n# Subexpression for properties/methods inside strings\n$greeting = \"Hello $($name.ToUpper()), welcome to $project\"\nWrite-Host $greeting"
                        }
                    ]
                },
                {
                    id: "m1s2",
                    title: "1.2 Arrays & Hashtables",
                    showEditor: true,
                    brief: "<ul><li>Arrays store multiple values in order using @()</li><li>Access items by index: $array[0]</li><li>Hashtables store key-value pairs using @{}</li><li>Access values by key: $hash.Key or $hash[\"Key\"]</li><li>Hashtables are perfect for API configurations</li></ul>",
                    description: "<h4>Arrays & Hashtables</h4><p><strong>Arrays</strong> hold ordered lists of items. <strong>Hashtables</strong> hold key-value pairs (like a dictionary). In Jira automation, you will use arrays to hold lists of tickets and hashtables for API headers and request bodies.</p><p>Arrays use <code>@()</code> syntax. Hashtables use <code>@{}</code> syntax. Notice the difference \u2014 parentheses vs braces.</p>",
                    syntax: "# Array\n$array = @(\"item1\", \"item2\", \"item3\")\n$array[0]  # First item\n\n# Hashtable\n$hash = @{ Key1 = \"Value1\"; Key2 = \"Value2\" }\n$hash.Key1  # Access by dot notation",
                    script: "Emphasize the visual difference: @() for arrays, @{} for hashtables. Show that hashtables are what we will use for API headers and JSON bodies. The config example directly previews the Jira config file students will create later.",
                    examples: [
                        {
                            name: "Arrays & Hashtables",
                            code: "# Arrays - ordered list of items\n$servers = @(\"srv1\", \"srv2\", \"srv3\")\n$ticketKeys = @(\"KAN-1\", \"KAN-2\", \"KAN-3\", \"KAN-4\")\n\n# Access by index (starts at 0)\nWrite-Host \"First server: $($servers[0])\"\nWrite-Host \"Total tickets: $($ticketKeys.Count)\"\n\n# Add to an array\n$ticketKeys += \"KAN-5\"\nWrite-Host \"After adding: $($ticketKeys.Count) tickets\"\n\n# Hashtables - key/value pairs (like a dictionary)\n$config = @{\n    BaseUrl   = \"https://api.atlassian.com\"\n    Project   = \"KAN\"\n    CloudId   = \"abc-123-def\"\n}\n\n# Access values\nWrite-Host \"Project: $($config.Project)\"\nWrite-Host \"URL: $($config.BaseUrl)\"\n\n# Hashtable for API headers (you will use this pattern A LOT)\n$headers = @{\n    \"Authorization\" = \"Bearer my-token-here\"\n    \"Accept\"        = \"application/json\"\n}\nWrite-Host \"Headers ready with $($headers.Count) entries\""
                        }
                    ]
                },
                {
                    id: "m1s3",
                    title: "1.3 Type Conversions & Operators",
                    showEditor: true,
                    brief: "<ul><li>PowerShell auto-converts types but you can cast explicitly</li><li>Arithmetic: +, -, *, /, % (modulus)</li><li>Comparison: -eq, -ne, -gt, -lt, -ge, -le</li><li>String operators: -like (wildcards), -match (regex)</li><li>Logical: -and, -or, -not</li></ul>",
                    description: "<h4>Type Conversions & Operators</h4><p>PowerShell is flexible with types \u2014 it auto-converts when possible. But you can also cast explicitly with <code>[int]</code>, <code>[string]</code>, <code>[bool]</code>. Operators in PowerShell use a dash prefix: <code>-eq</code> instead of <code>==</code>, <code>-ne</code> instead of <code>!=</code>.</p><p><strong>Why this matters:</strong> When parsing Jira API responses, you will compare statuses, check dates, and filter tickets using these operators.</p>",
                    syntax: "# Comparison operators\n-eq   # Equal\n-ne   # Not equal\n-gt   # Greater than\n-lt   # Less than\n-like # Wildcard match\n-match # Regex match",
                    script: "Key point: PowerShell does NOT use == or != like other languages. This is the #1 syntax mistake for people coming from Python or JavaScript. Drill the -eq / -ne pattern. Show -like with wildcards for filtering ticket summaries later.",
                    examples: [
                        {
                            name: "Operators & Comparisons",
                            code: "# Arithmetic operators\n$ticketCount = 50\n$resolved = 35\n$remaining = $ticketCount - $resolved\nWrite-Host \"Remaining tickets: $remaining\"\n\n$percentDone = [math]::Round(($resolved / $ticketCount) * 100, 1)\nWrite-Host \"Progress: $percentDone%\"\n\n# Comparison operators (NOT == or !=)\n$status = \"In Progress\"\nWrite-Host ($status -eq \"Done\")         # False\nWrite-Host ($status -ne \"Done\")         # True\nWrite-Host ($remaining -gt 10)           # True\n\n# String operators\n$summary = \"Database backup failed on SRV-01\"\nWrite-Host ($summary -like \"*backup*\")   # True (wildcard)\nWrite-Host ($summary -match \"SRV-\\d+\")  # True (regex)\n\n# Logical operators\n$priority = \"High\"\n$isUrgent = ($priority -eq \"High\") -and ($status -ne \"Done\")\nWrite-Host \"Urgent? $isUrgent\"\n\n# Type casting\n$numberString = \"42\"\n$actual = [int]$numberString + 8\nWrite-Host \"Result: $actual\"  # 50"
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 2: PowerShell Basics \u2014 Control Flow",
            sections: [
                {
                    id: "m2s1",
                    title: "2.1 If/Else & Switch",
                    showEditor: true,
                    brief: "<ul><li>if/elseif/else for conditional logic</li><li>Conditions use PowerShell operators (-eq, -ne, -like)</li><li>Switch statement for multiple value checks</li><li>Switch is cleaner than many if/elseif chains</li><li>Use these to route tickets based on status or priority</li></ul>",
                    description: "<h4>If/Else & Switch</h4><p>Conditional logic lets your scripts make decisions. Use <code>if/elseif/else</code> for simple checks and <code>switch</code> when comparing one value against many options.</p><p><strong>Real-world use:</strong> Check if a ticket status is Done, route tickets by priority, decide whether to send an alert.</p>",
                    syntax: "if ($condition) {\n    # do something\n} elseif ($other) {\n    # alternative\n} else {\n    # default\n}\n\nswitch ($value) {\n    \"Option1\" { # action }\n    \"Option2\" { # action }\n    default   { # fallback }\n}",
                    script: "Use ticket status as the example \u2014 it is relatable and directly applicable. Show that switch is preferred when you have 3+ conditions on the same variable. Mention that Jira tickets have statuses like To Do, In Progress, In Review, Done.",
                    examples: [
                        {
                            name: "If/Else & Switch",
                            code: "# If/Else - check ticket status\n$status = \"In Progress\"\n$priority = \"High\"\n\nif ($status -eq \"Done\") {\n    Write-Host \"Ticket is resolved - no action needed\"\n} elseif ($status -eq \"In Progress\") {\n    Write-Host \"Ticket is being worked on\"\n} else {\n    Write-Host \"Ticket needs attention!\"\n}\n\n# Combine conditions with -and / -or\nif (($priority -eq \"High\") -and ($status -ne \"Done\")) {\n    Write-Host \"ALERT: High priority ticket still open!\"\n}\n\n# Switch - cleaner for multiple status checks\n$ticketStatus = \"In Review\"\n\nswitch ($ticketStatus) {\n    \"To Do\"       { Write-Host \"Not started yet\" }\n    \"In Progress\" { Write-Host \"Someone is working on it\" }\n    \"In Review\"   { Write-Host \"Waiting for review\" }\n    \"Done\"        { Write-Host \"Completed!\" }\n    default       { Write-Host \"Unknown status: $ticketStatus\" }\n}"
                        }
                    ]
                },
                {
                    id: "m2s2",
                    title: "2.2 Loops (ForEach, For, While)",
                    showEditor: true,
                    brief: "<ul><li>ForEach-Object loops through collections (most common)</li><li>foreach statement for simple iteration</li><li>for loop when you need an index counter</li><li>While loop for condition-based repetition</li><li>Pipeline | ForEach-Object for chaining</li></ul>",
                    description: "<h4>Loops</h4><p>Loops repeat actions for each item in a collection. In Jira automation, you will loop through tickets, users, and API responses constantly. <code>ForEach-Object</code> (pipeline) and <code>foreach</code> (statement) are the most common.</p><p><strong>Key difference:</strong> <code>foreach ($item in $collection)</code> is a statement. <code>$collection | ForEach-Object { }</code> uses the pipeline. Both work \u2014 pipeline is more PowerShell-idiomatic.</p>",
                    syntax: "# foreach statement\nforeach ($item in $collection) {\n    # process $item\n}\n\n# Pipeline ForEach-Object\n$collection | ForEach-Object {\n    # $_ is current item\n}",
                    script: "Use ticket names as the collection \u2014 keeps it relevant. Show both foreach styles. Emphasize that $_ (dollar underscore) represents the current item in pipeline loops. This is critical for later when processing API responses.",
                    examples: [
                        {
                            name: "Loops in Action",
                            code: "# Sample ticket data\n$tickets = @(\"KAN-1: Fix login bug\", \"KAN-2: Update dashboard\", \"KAN-3: Add export feature\")\n\n# foreach statement - simple and clear\nWrite-Host \"=== All Tickets ===\"\nforeach ($ticket in $tickets) {\n    Write-Host \"  > $ticket\"\n}\n\n# ForEach-Object with pipeline (uses $_ for current item)\nWrite-Host \"`n=== Tickets with 'bug' ===\"\n$tickets | ForEach-Object {\n    if ($_ -like \"*bug*\") {\n        Write-Host \"  FOUND: $_\"\n    }\n}\n\n# for loop - when you need the index\nWrite-Host \"`n=== Numbered List ===\"\nfor ($i = 0; $i -lt $tickets.Count; $i++) {\n    Write-Host \"  $($i + 1). $($tickets[$i])\"\n}\n\n# While loop - repeat until condition is false\n$attempts = 0\n$maxAttempts = 3\nwhile ($attempts -lt $maxAttempts) {\n    $attempts++\n    Write-Host \"API attempt $attempts of $maxAttempts\"\n}\nWrite-Host \"Done after $attempts attempts\""
                        }
                    ]
                },
                {
                    id: "m2s3",
                    title: "2.3 Functions & Parameters",
                    showEditor: true,
                    brief: "<ul><li>Functions group reusable code with the function keyword</li><li>Parameters make functions flexible</li><li>[Parameter(Mandatory)] forces required input</li><li>Use Verb-Noun naming: Get-Greeting, Set-Status</li><li>Functions return values with return or by outputting to pipeline</li></ul>",
                    description: "<h4>Functions & Parameters</h4><p>Functions let you write code once and reuse it. PowerShell uses <strong>Verb-Noun</strong> naming: <code>Get-Something</code>, <code>Set-Something</code>, <code>New-Something</code>. Parameters make functions flexible \u2014 you pass in different values each time.</p><p><strong>Why this matters:</strong> Every Jira script we build will be wrapped in a function with parameters (ticket key, status, assignee, etc.).</p>",
                    syntax: "function Verb-Noun {\n    param(\n        [Parameter(Mandatory)]\n        [string]$ParamName\n    )\n    # function body\n    return $result\n}",
                    script: "Start with a dead-simple function, then add parameters. Show [Parameter(Mandatory)] which forces the user to provide a value. Mention that all our Jira functions will follow this exact pattern. The Get-Greeting example is intentionally simple before we build real Jira functions.",
                    examples: [
                        {
                            name: "Functions & Parameters",
                            code: "# Simple function - no parameters\nfunction Get-Greeting {\n    return \"Hello from PowerShell!\"\n}\n\n$result = Get-Greeting\nWrite-Host $result\n\n# Function with parameters\nfunction Get-TicketUrl {\n    param(\n        [Parameter(Mandatory)]\n        [string]$TicketKey,\n\n        [string]$BaseUrl = \"https://yoursite.atlassian.net\"\n    )\n\n    $url = \"$BaseUrl/browse/$TicketKey\"\n    return $url\n}\n\n# Call with parameters\n$url = Get-TicketUrl -TicketKey \"KAN-5\"\nWrite-Host \"Ticket URL: $url\"\n\n# With custom base URL\n$url2 = Get-TicketUrl -TicketKey \"KAN-12\" -BaseUrl \"https://mycompany.atlassian.net\"\nWrite-Host \"Custom URL: $url2\"\n\n# Function with ValidateSet (restricts allowed values)\nfunction Set-Priority {\n    param(\n        [ValidateSet(\"Low\", \"Medium\", \"High\", \"Critical\")]\n        [string]$Level = \"Medium\"\n    )\n    Write-Host \"Priority set to: $Level\"\n}\n\nSet-Priority -Level \"High\""
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 3: PowerShell Basics \u2014 Files & JSON",
            sections: [
                {
                    id: "m3s1",
                    title: "3.1 Reading & Writing Files",
                    showEditor: true,
                    brief: "<ul><li>Get-Content reads file contents</li><li>Set-Content writes (overwrites) a file</li><li>Add-Content appends to a file</li><li>Out-File sends output to a file</li><li>Test-Path checks if a file exists before reading</li></ul>",
                    description: "<h4>Reading & Writing Files</h4><p>File operations are essential for automation. You will read config files, write logs, and store tokens. PowerShell makes this simple with built-in cmdlets.</p><p><strong>Key cmdlets:</strong></p><ul><li><code>Get-Content</code> \u2014 reads a file (returns array of lines or -Raw for single string)</li><li><code>Set-Content</code> \u2014 writes/overwrites a file</li><li><code>Add-Content</code> \u2014 appends to existing file</li><li><code>Test-Path</code> \u2014 checks if file exists (always check before reading!)</li></ul>",
                    syntax: "Get-Content -Path \"file.txt\"\nGet-Content -Path \"file.txt\" -Raw\nSet-Content -Path \"file.txt\" -Value \"content\"\nAdd-Content -Path \"file.txt\" -Value \"new line\"\nTest-Path \"file.txt\"  # Returns True/False",
                    script: "Emphasize Test-Path before Get-Content \u2014 reading a non-existent file throws an error. Show -Raw parameter which returns the entire file as one string (critical for JSON files). The log file example previews how we will log API calls later.",
                    examples: [
                        {
                            name: "File Operations",
                            code: "# Always check if file exists first\n$logFile = \"D:\\JiraAutomation\\Scripts\\automation.log\"\n\nif (Test-Path $logFile) {\n    Write-Host \"Log file exists\"\n    $content = Get-Content -Path $logFile\n    Write-Host \"Lines in log: $($content.Count)\"\n} else {\n    Write-Host \"Log file not found - creating it\"\n    Set-Content -Path $logFile -Value \"=== Jira Automation Log ===\"\n}\n\n# Append a log entry\n$timestamp = Get-Date -Format \"yyyy-MM-dd HH:mm:ss\"\nAdd-Content -Path $logFile -Value \"[$timestamp] Script started\"\n\n# Read entire file as single string (important for JSON!)\n$rawContent = Get-Content -Path $logFile -Raw\nWrite-Host \"`nFull file content:\"\nWrite-Host $rawContent\n\n# Write structured output to file\n$report = @\"\nTicket Report\nGenerated: $(Get-Date)\nTotal Open: 15\nHigh Priority: 3\n\"@\nSet-Content -Path \"D:\\JiraAutomation\\Scripts\\report.txt\" -Value $report\nWrite-Host \"`nReport written successfully\""
                        }
                    ]
                },
                {
                    id: "m3s2",
                    title: "3.2 Working with JSON",
                    showEditor: true,
                    brief: "<ul><li>JSON is the language of REST APIs</li><li>ConvertTo-Json turns PowerShell objects into JSON strings</li><li>ConvertFrom-Json turns JSON strings into PowerShell objects</li><li>Use -Depth parameter for nested objects (default is only 2 levels!)</li><li>Config files are stored as JSON</li></ul>",
                    description: "<h4>Working with JSON</h4><p>JSON (JavaScript Object Notation) is how REST APIs communicate. Every Jira API request and response uses JSON. PowerShell converts between JSON and PowerShell objects seamlessly.</p><p><strong>Critical gotcha:</strong> <code>ConvertTo-Json</code> only goes 2 levels deep by default! For nested Jira API bodies, always use <code>-Depth 10</code>.</p>",
                    syntax: "# PowerShell object to JSON\n$object | ConvertTo-Json -Depth 10\n\n# JSON string to PowerShell object\n$json | ConvertFrom-Json\n\n# Read JSON config file\n$config = Get-Content \"config.json\" -Raw | ConvertFrom-Json",
                    script: "The -Depth gotcha is CRITICAL. Show what happens without it (nested objects become truncated). Every student will hit this bug if not warned. The config file example is exactly what they will create in Module 6.",
                    examples: [
                        {
                            name: "JSON Conversion",
                            code: "# Create a PowerShell hashtable (like a Jira API body)\n$ticketBody = @{\n    fields = @{\n        project  = @{ key = \"KAN\" }\n        summary  = \"Server backup failed\"\n        issuetype = @{ name = \"Task\" }\n        priority = @{ name = \"High\" }\n    }\n}\n\n# Convert to JSON - ALWAYS use -Depth for nested objects!\n$json = $ticketBody | ConvertTo-Json -Depth 10\nWrite-Host \"=== JSON Output ===\"\nWrite-Host $json\n\n# Convert JSON back to PowerShell object\n$parsed = $json | ConvertFrom-Json\nWrite-Host \"`n=== Parsed Back ===\"\nWrite-Host \"Project: $($parsed.fields.project.key)\"\nWrite-Host \"Summary: $($parsed.fields.summary)\"\n\n# Read a JSON config file (pattern we will use throughout)\n$configJson = @'\n{\n    \"BaseUrl\": \"https://api.atlassian.com\",\n    \"Project\": \"KAN\",\n    \"CloudId\": \"abc-123-def-456\"\n}\n'@\n\n$config = $configJson | ConvertFrom-Json\nWrite-Host \"`n=== Config Loaded ===\"\nWrite-Host \"Project: $($config.Project)\"\nWrite-Host \"Cloud ID: $($config.CloudId)\""
                        }
                    ]
                },
                {
                    id: "m3s3",
                    title: "3.3 PowerShell Modules (Import-Module)",
                    showEditor: true,
                    brief: "<ul><li>Modules (.psm1) package reusable functions</li><li>Import-Module loads a module into your session</li><li>-Force flag reloads if already imported</li><li>Modules keep code organized and DRY</li><li>Our JiraAuth module will contain all authentication functions</li></ul>",
                    description: "<h4>PowerShell Modules</h4><p>A module is a <code>.psm1</code> file containing functions you want to reuse across scripts. Instead of copying the same code into every script, you write it once in a module and <code>Import-Module</code> it wherever needed.</p><p><strong>Our plan:</strong> We will create a <code>JiraAuth.psm1</code> module with all authentication and token functions. Every script will import it with one line.</p>",
                    syntax: "# Import a module\nImport-Module \"path\\to\\Module.psm1\" -Force\n\n# Module file structure (.psm1)\nfunction Get-Something { ... }\nfunction Set-Something { ... }",
                    script: "This is the bridge to the real project. Show how a simple module works, then explain that our JiraAuth module will follow this exact pattern. The -Force flag is important because during development you change the module and need to reload it.",
                    examples: [
                        {
                            name: "Creating a Module",
                            code: "# === Step 1: Create a module file ===\n# Save this as D:\\JiraAutomation\\Helpers\\MathHelpers.psm1\n\n$moduleContent = @'\nfunction Get-Percentage {\n    param(\n        [int]$Part,\n        [int]$Total\n    )\n    if ($Total -eq 0) { return 0 }\n    return [math]::Round(($Part / $Total) * 100, 1)\n}\n\nfunction Get-TicketSummary {\n    param(\n        [int]$Open,\n        [int]$Closed\n    )\n    $total = $Open + $Closed\n    $pct = Get-Percentage -Part $Closed -Total $total\n    return \"$Closed of $total tickets closed ($pct%)\"\n}\n'@\n\nWrite-Host \"Module content ready.\"\nWrite-Host \"In practice, save this to a .psm1 file.\"\n\n# === Step 2: Import and use ===\n# Import-Module \"D:\\JiraAutomation\\Helpers\\MathHelpers.psm1\" -Force\n# $summary = Get-TicketSummary -Open 15 -Closed 35\n# Write-Host $summary\n\n# For this demo, we will define inline:\nfunction Get-Percentage { param([int]$Part, [int]$Total)\n    if ($Total -eq 0) { return 0 }\n    return [math]::Round(($Part / $Total) * 100, 1)\n}\n\n$result = Get-Percentage -Part 35 -Total 50\nWrite-Host \"Completion: $result%\""
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 4: REST APIs with PowerShell",
            sections: [
                {
                    id: "m4s1",
                    title: "4.1 Understanding REST APIs",
                    showEditor: false,
                    brief: "<ul><li>REST API = a way for programs to talk to web services</li><li>HTTP Methods: GET (read), POST (create), PUT (update), DELETE (remove)</li><li>Headers carry metadata (authentication, content type)</li><li>Request body carries data (JSON format)</li><li>Status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found</li><li>Jira Cloud REST API v3 is what we will use</li></ul>",
                    description: "<h4>Understanding REST APIs</h4><p>A REST API is like a waiter at a restaurant. You (the client) send a <strong>request</strong> to the server, and it sends back a <strong>response</strong>. The request includes:</p><ul><li><strong>URL</strong> \u2014 where to send it (the endpoint)</li><li><strong>Method</strong> \u2014 what action (GET, POST, PUT, DELETE)</li><li><strong>Headers</strong> \u2014 metadata (who you are, what format you want)</li><li><strong>Body</strong> \u2014 data you are sending (for POST/PUT)</li></ul><p><strong>HTTP Methods mapped to Jira:</strong></p><ul><li><code>GET /issue/KAN-5</code> \u2014 Read a ticket</li><li><code>POST /issue</code> \u2014 Create a new ticket</li><li><code>PUT /issue/KAN-5/assignee</code> \u2014 Update assignee</li><li><code>DELETE /issue/KAN-5</code> \u2014 Delete a ticket</li></ul><p><strong>Status Codes:</strong> 200 = success, 201 = created, 400 = bad request, 401 = not authenticated, 403 = forbidden, 404 = not found</p>",
                    syntax: "",
                    script: "This is conceptual \u2014 no code to run. Use the restaurant analogy: URL is the restaurant address, Method is your order type (dine-in, takeout, delivery), Headers are your reservation details, Body is your actual order. Draw this on a whiteboard if possible.\n\nKey insight: Every Jira action you do in the browser (create ticket, change status, add comment) has a corresponding API endpoint. We are just doing the same thing programmatically.",
                    examples: []
                },
                {
                    id: "m4s2",
                    title: "4.2 Invoke-RestMethod in Practice",
                    showEditor: true,
                    brief: "<ul><li>Invoke-RestMethod is PowerShell's HTTP client</li><li>Automatically parses JSON responses into objects</li><li>Supports all HTTP methods: GET, POST, PUT, DELETE</li><li>-Headers parameter for authentication</li><li>-Body parameter for request data</li><li>-ContentType specifies the format</li></ul>",
                    description: "<h4>Invoke-RestMethod in Practice</h4><p><code>Invoke-RestMethod</code> is the single most important cmdlet for this course. It sends HTTP requests and automatically converts JSON responses into PowerShell objects you can work with.</p><p><strong>Instructions:</strong> We will call a free public API (JSONPlaceholder) to practice the pattern before connecting to Jira. This is the exact same pattern we will use for every Jira call.</p>",
                    syntax: "# GET request\nInvoke-RestMethod -Uri $url -Method Get -Headers $headers\n\n# POST request with body\nInvoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $jsonBody -ContentType \"application/json\"",
                    script: "Use jsonplaceholder.typicode.com \u2014 it is free, no auth needed, and returns realistic data. Show GET first (simple), then POST (creating data). Emphasize that the Jira pattern is identical, just with different URLs and an Authorization header.\n\nThis is the 'aha' moment where students see how PowerShell talks to web services.",
                    examples: [
                        {
                            name: "Calling a REST API",
                            code: "# GET request - fetch data from a public API\n$url = \"https://jsonplaceholder.typicode.com/todos/1\"\n$response = Invoke-RestMethod -Uri $url -Method Get\n\nWrite-Host \"=== GET Response ===\"\nWrite-Host \"Title: $($response.title)\"\nWrite-Host \"Completed: $($response.completed)\"\n\n# GET multiple items\n$todos = Invoke-RestMethod -Uri \"https://jsonplaceholder.typicode.com/todos?_limit=5\"\nWrite-Host \"`n=== First 5 Todos ===\"\n$todos | ForEach-Object {\n    $status = if ($_.completed) { \"Done\" } else { \"Open\" }\n    Write-Host \"  [$status] $($_.title)\"\n}\n\n# POST request - create new data (same pattern as creating Jira tickets)\n$body = @{\n    title     = \"Automate Jira with PowerShell\"\n    body      = \"This is a test post from PowerShell\"\n    userId    = 1\n} | ConvertTo-Json\n\n$newPost = Invoke-RestMethod -Uri \"https://jsonplaceholder.typicode.com/posts\" `\n    -Method Post `\n    -Body $body `\n    -ContentType \"application/json\"\n\nWrite-Host \"`n=== POST Response ===\"\nWrite-Host \"Created with ID: $($newPost.id)\"\nWrite-Host \"Title: $($newPost.title)\""
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 5: Why Automate Jira?",
            sections: [
                {
                    id: "m5s1",
                    title: "5.1 The Problem \u2014 Manual Jira Management",
                    showEditor: false,
                    brief: "<ul><li>DBA teams receive 50+ Jira tickets daily</li><li>Manual triage takes 2+ hours every morning</li><li>Tickets fall through the cracks \u2014 SLAs get breached</li><li>No visibility into workload distribution</li><li>Status updates are forgotten or delayed</li><li>Management asks for reports that take 30 minutes to compile</li></ul>",
                    description: "<h4>The Problem \u2014 Manual Jira Management</h4><p><strong>Story:</strong> A team of 5 DBAs at a mid-size company received 50+ Jira tickets daily. Every morning, one person spent 2 hours just opening Jira, checking new tickets, assigning them to team members, and updating statuses. Tickets fell through the cracks. A P1 database outage ticket sat unassigned for 3 days because it was buried in the backlog. The SLA breach cost the company $50K in penalties.</p><p><strong>Common pain points:</strong></p><ul><li>Checking tickets manually \u2014 open browser, click through boards, read each one</li><li>Missing SLAs \u2014 no automated alerts when deadlines approach</li><li>No visibility \u2014 managers ask \"how many tickets are open?\" and it takes 30 min to answer</li><li>Human error \u2014 tickets assigned to wrong people, statuses not updated</li><li>Repetitive work \u2014 same actions every day, soul-crushing for skilled engineers</li></ul><p><em>\"We are not replacing Jira. We are making Jira work FOR us instead of us working for Jira.\"</em></p>",
                    syntax: "",
                    script: "This is a storytelling section. Share the real pain. Ask students: How many of you check Jira first thing in the morning? How long does it take? Have you ever missed an SLA? The goal is to make them FEEL the problem before showing the solution.\n\nStory: The $50K SLA breach is a real scenario. One unassigned P1 ticket, 3 days unnoticed, massive penalty. After automation: unassigned tickets trigger an email alert within 15 minutes.",
                    examples: []
                },
                {
                    id: "m5s2",
                    title: "5.2 The Solution \u2014 What We Will Build",
                    showEditor: false,
                    brief: "<ul><li>Query all open tickets in 2 seconds</li><li>Create tickets programmatically</li><li>Change assignees and statuses via script</li><li>Add comments automatically</li><li>Send HTML email reports daily</li><li>Schedule everything with Task Scheduler</li></ul>",
                    description: "<h4>The Solution \u2014 What We Will Build</h4><p>By the end of this course, you will have a complete automation suite that handles all the repetitive Jira work. Here is what each script does:</p><ul><li><strong>Get-OpenDBATickets.ps1</strong> \u2014 Query all open tickets with one command</li><li><strong>Create-NewTicket.ps1</strong> \u2014 Create tickets from PowerShell (no browser needed)</li><li><strong>Change-Assignee.ps1</strong> \u2014 Reassign tickets by name</li><li><strong>Change-TicketStatus.ps1</strong> \u2014 Move tickets through workflow (To Do \u2192 In Progress \u2192 Done)</li><li><strong>Update-TicketComment.ps1</strong> \u2014 Add comments programmatically</li><li><strong>Alert_AllTickets.ps1</strong> \u2014 Email an HTML report of all open tickets</li></ul><p><strong>Project Structure (create this in VS Code):</strong></p><pre>D:\\JiraAutomation\\\n\u251c\u2500\u2500 Config\\\n\u2502   \u2514\u2500\u2500 jira_global_config.json\n\u251c\u2500\u2500 JiraAuth\\\n\u2502   \u251c\u2500\u2500 JiraAuth.psm1\n\u2502   \u2514\u2500\u2500 Init-JiraAuth.ps1\n\u2514\u2500\u2500 Scripts\\\n    \u251c\u2500\u2500 Get-OpenDBATickets.ps1\n    \u251c\u2500\u2500 Create-NewTicket.ps1\n    \u251c\u2500\u2500 Change-Assignee.ps1\n    \u251c\u2500\u2500 Change-TicketStatus.ps1\n    \u251c\u2500\u2500 Update-TicketComment.ps1\n    \u2514\u2500\u2500 Alert_AllTickets.ps1</pre><p><strong>Action:</strong> Open VS Code and create the folder structure above. Right-click in Explorer \u2192 New Folder for each directory.</p>",
                    syntax: "",
                    script: "Show the folder structure on screen. Have students create it NOW in VS Code. This is their project workspace for the rest of the course. Every script from here on goes into one of these folders.\n\nTip: Open a terminal in VS Code and run:\nmkdir D:\\JiraAutomation\\Config\nmkdir D:\\JiraAutomation\\JiraAuth\nmkdir D:\\JiraAutomation\\Scripts",
                    examples: []
                }
            ]
        },
        {
            title: "Module 6: Setting Up the Jira App",
            sections: [
                {
                    id: "m6s1",
                    title: "6.1 Creating an Atlassian Developer App",
                    showEditor: false,
                    brief: "<ul><li>Go to developer.atlassian.com/console/myapps</li><li>Click Create \u2192 OAuth 2.0 Integration</li><li>Name it: PowerShell Jira Automation</li><li>Under Permissions, add: read:jira-work, write:jira-work, manage:jira-project, read:jira-user</li><li>Under Authorization, set Callback URL: https://localhost</li><li>Under Settings, copy your Client ID and Client Secret</li><li>Add offline_access scope for refresh tokens</li></ul>",
                    description: "<h4>Creating an Atlassian Developer App</h4><p>Before PowerShell can talk to Jira, you need to register an OAuth 2.0 app. This gives you credentials (Client ID and Secret) that identify your automation.</p><p><strong>Step-by-step:</strong></p><ol><li>Go to <code>developer.atlassian.com/console/myapps</code></li><li>Click <strong>Create</strong> \u2192 <strong>OAuth 2.0 Integration</strong></li><li>Name: <code>PowerShell Jira Automation</code></li><li>Under <strong>Permissions</strong> \u2192 Add <strong>Jira API</strong>:<ul><li><code>read:jira-work</code> \u2014 read tickets</li><li><code>write:jira-work</code> \u2014 create/update tickets</li><li><code>manage:jira-project</code> \u2014 manage project settings</li><li><code>read:jira-user</code> \u2014 look up users for assignment</li></ul></li><li>Under <strong>Authorization</strong> \u2192 Add callback URL: <code>https://localhost</code></li><li>Under <strong>Settings</strong> \u2192 Copy your <strong>Client ID</strong> and <strong>Client Secret</strong></li></ol><p><strong>Important:</strong> The <code>offline_access</code> scope is added during the auth request (not in the console). It enables refresh tokens so you do not have to re-login every hour.</p>",
                    syntax: "",
                    script: "Walk through this live on screen if possible. The Atlassian Developer Console UI changes occasionally, but the steps remain the same. Key point: Client Secret is shown ONCE \u2014 copy it immediately and save it somewhere safe.\n\nCommon mistake: Students forget to add the callback URL. Without it, the OAuth flow will fail with a redirect_uri mismatch error.",
                    examples: []
                },
                {
                    id: "m6s2",
                    title: "6.2 Creating the Config File",
                    showEditor: true,
                    brief: "<ul><li>Config file stores all connection settings in one place</li><li>JSON format for easy reading by PowerShell</li><li>Contains: ClientId, ClientSecret, CloudId, RedirectUri, TokenFile path</li><li>Never hardcode credentials in scripts \u2014 always use a config file</li><li>Create at: D:\\JiraAutomation\\Config\\jira_global_config.json</li></ul>",
                    description: "<h4>Creating the Config File</h4><p>Instead of hardcoding credentials in every script, we store them in a single JSON config file. Every script reads this file to get connection details.</p><p><strong>Instructions:</strong> Create this file at <code>D:\\JiraAutomation\\Config\\jira_global_config.json</code></p><p>Replace the placeholder values with your actual Client ID, Client Secret, and Cloud ID (we will find the Cloud ID in the next section).</p>",
                    syntax: "# Reading the config in any script:\n$config = Get-Content \"D:\\JiraAutomation\\Config\\jira_global_config.json\" | ConvertFrom-Json\n$config.ClientId\n$config.CloudId",
                    script: "Have students create this file NOW. They should paste their actual Client ID and Secret from the previous step. The CloudId will be filled in after the next section. TokenFile path points to where encrypted tokens will be stored.\n\nSecurity note: This file contains secrets. In production, you would use a vault or environment variables. For learning, a local file is fine.",
                    examples: [
                        {
                            name: "jira_global_config.json",
                            code: "# Create this file: D:\\JiraAutomation\\Config\\jira_global_config.json\n# Copy the JSON below into that file (replace YOUR_ values)\n\n<#\n{\n    \"ClientId\": \"YOUR_CLIENT_ID\",\n    \"ClientSecret\": \"YOUR_CLIENT_SECRET\",\n    \"CloudId\": \"YOUR_CLOUD_ID\",\n    \"RedirectUri\": \"https://localhost\",\n    \"TokenFile\": \"D:\\\\JiraAutomation\\\\JiraAuth\\\\.jira_tokens.sec\",\n    \"SiteUrl\": \"https://yoursite.atlassian.net\"\n}\n#>\n\n# After creating the file, test that PowerShell can read it:\n$configPath = \"D:\\JiraAutomation\\Config\\jira_global_config.json\"\n\nif (Test-Path $configPath) {\n    $config = Get-Content $configPath -Raw | ConvertFrom-Json\n    Write-Host \"Config loaded successfully!\"\n    Write-Host \"Client ID: $($config.ClientId.Substring(0,8))...\" \n    Write-Host \"Redirect URI: $($config.RedirectUri)\"\n    Write-Host \"Token File: $($config.TokenFile)\"\n} else {\n    Write-Host \"ERROR: Config file not found at $configPath\"\n    Write-Host \"Create the file first, then run this again.\"\n}"
                        }
                    ]
                },
                {
                    id: "m6s3",
                    title: "6.3 Finding Your Cloud ID",
                    showEditor: true,
                    brief: "<ul><li>Cloud ID uniquely identifies your Jira site</li><li>Required for all API calls (part of the URL)</li><li>Found via the accessible-resources endpoint</li><li>You need a valid access token first (chicken-and-egg solved by manual token)</li><li>Update your config file with the Cloud ID</li></ul>",
                    description: "<h4>Finding Your Cloud ID</h4><p>Every Jira Cloud API call includes your Cloud ID in the URL: <code>https://api.atlassian.com/ex/jira/{cloudId}/rest/api/3/...</code></p><p>To find it, you call the <code>accessible-resources</code> endpoint with a valid access token. This returns all Jira sites your app can access.</p><p><strong>Instructions:</strong> After completing the OAuth login (Module 7), run this script to find your Cloud ID, then update your <code>jira_global_config.json</code> file.</p>",
                    syntax: "# API URL pattern with Cloud ID:\nhttps://api.atlassian.com/ex/jira/{cloudId}/rest/api/3/...",
                    script: "This is a bit of a chicken-and-egg problem: you need a token to find the Cloud ID, but you need the Cloud ID for API calls. Solution: run Init-JiraAuth.ps1 first (next module), then come back and run this to get the Cloud ID.\n\nAlternative: You can also find it by going to your Jira site, opening Developer Tools (F12), and looking at network requests to api.atlassian.com.",
                    examples: [
                        {
                            name: "Find Cloud ID",
                            code: "# After getting an access token (from Init-JiraAuth.ps1), find your Cloud ID\n# This script assumes you have already run the OAuth login once\n\nImport-Module \"D:\\JiraAutomation\\JiraAuth\\JiraAuth.psm1\" -Force\n\n$accessToken = Get-JiraAccessToken\n\nif (-not $accessToken) {\n    Write-Host \"ERROR: No access token available.\" -ForegroundColor Red\n    Write-Host \"Run Init-JiraAuth.ps1 first to complete OAuth login.\"\n} else {\n    # Call the accessible-resources endpoint\n    $response = Invoke-RestMethod -Uri \"https://api.atlassian.com/oauth/token/accessible-resources\" `\n        -Headers @{ Authorization = \"Bearer $accessToken\" } `\n        -Method Get\n\n    Write-Host \"=== Your Jira Cloud Sites ===\" -ForegroundColor Green\n    $response | Format-Table id, name, url -AutoSize\n\n    Write-Host \"`nCopy the 'id' value and paste it as CloudId in your config file.\"\n    Write-Host \"Config location: D:\\JiraAutomation\\Config\\jira_global_config.json\"\n}"
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 7: Building the Authentication Module",
            sections: [
                {
                    id: "m7s1",
                    title: "7.1 AES Encryption Functions",
                    showEditor: true,
                    brief: "<ul><li>Tokens must be stored securely (not plain text!)</li><li>AES-256 encryption protects stored tokens</li><li>Key and IV are generated once and stored locally</li><li>Encrypt-Data converts plain text to encrypted base64</li><li>Decrypt-Data reverses the process</li><li>These functions go in JiraAuth.psm1</li></ul>",
                    description: "<h4>AES Encryption Functions</h4><p>OAuth tokens are sensitive \u2014 anyone with your access token can make API calls as you. We encrypt tokens before storing them on disk using AES-256 encryption.</p><p><strong>Instructions:</strong> Create <code>D:\\JiraAutomation\\JiraAuth\\JiraAuth.psm1</code> and add this code. This is the beginning of our authentication module.</p><p><strong>How it works:</strong></p><ul><li>AES key and IV are generated once (first run) and stored in hidden files</li><li><code>Encrypt-Data</code> takes plain text \u2192 returns encrypted base64 string</li><li><code>Decrypt-Data</code> takes encrypted base64 \u2192 returns original plain text</li></ul>",
                    syntax: "# AES encryption pattern:\n$aes = [System.Security.Cryptography.Aes]::Create()\n$aes.Key = $keyBytes\n$aes.IV = $ivBytes\n$encryptor = $aes.CreateEncryptor()\n$encrypted = $encryptor.TransformFinalBlock($data, 0, $data.Length)",
                    script: "Explain that we are NOT using DPAPI (Windows Data Protection API) because it is user-bound and breaks when running as a scheduled task under a different account. AES with a local key file works everywhere.\n\nDon't get bogged down in cryptography theory. The key point is: tokens go in encrypted, come out decrypted. The functions handle it.",
                    examples: [
                        {
                            name: "JiraAuth.psm1 - Part 1: Encryption",
                            code: "# ==============================================\n# JiraAuth.psm1 - Part 1: AES Encryption\n# Create this file: D:\\JiraAutomation\\JiraAuth\\JiraAuth.psm1\n# ==============================================\n\n# Load global config\n$global:JiraConfig = Get-Content \"D:\\JiraAutomation\\Config\\jira_global_config.json\" | ConvertFrom-Json\n\n# AES key storage files\n$keyFile = \"D:\\JiraAutomation\\JiraAuth\\.aes_key\"\n$ivFile  = \"D:\\JiraAutomation\\JiraAuth\\.aes_iv\"\n\n# Create AES key + IV if they don't exist yet (first run only)\nif (!(Test-Path $keyFile) -or !(Test-Path $ivFile)) {\n    $aes = [System.Security.Cryptography.Aes]::Create()\n    $aes.KeySize = 256\n    Set-Content -Path $keyFile -Value ([Convert]::ToBase64String($aes.Key))\n    Set-Content -Path $ivFile  -Value ([Convert]::ToBase64String($aes.IV))\n    Write-Host \"AES key and IV generated (first run).\"\n}\n\n# Load AES key + IV\n$aesKey = [Convert]::FromBase64String((Get-Content $keyFile -Raw))\n$aesIV  = [Convert]::FromBase64String((Get-Content $ivFile  -Raw))\n\nfunction Encrypt-Data {\n    param([Parameter(Mandatory)] [string]$PlainText)\n\n    $aes = [System.Security.Cryptography.Aes]::Create()\n    $aes.Key = $aesKey\n    $aes.IV  = $aesIV\n\n    $bytes     = [System.Text.Encoding]::UTF8.GetBytes($PlainText)\n    $encryptor = $aes.CreateEncryptor()\n    $encBytes  = $encryptor.TransformFinalBlock($bytes, 0, $bytes.Length)\n\n    return [Convert]::ToBase64String($encBytes)\n}\n\nfunction Decrypt-Data {\n    param([Parameter(Mandatory)] [string]$CipherText)\n\n    $aes = [System.Security.Cryptography.Aes]::Create()\n    $aes.Key = $aesKey\n    $aes.IV  = $aesIV\n\n    $cipherBytes = [Convert]::FromBase64String($CipherText)\n    $decryptor   = $aes.CreateDecryptor()\n    $plainBytes  = $decryptor.TransformFinalBlock($cipherBytes, 0, $cipherBytes.Length)\n\n    return [System.Text.Encoding]::UTF8.GetString($plainBytes)\n}"
                        }
                    ]
                },
                {
                    id: "m7s2",
                    title: "7.2 Token Storage Functions",
                    showEditor: true,
                    brief: "<ul><li>Save-JiraTokens encrypts and stores tokens to disk</li><li>Get-JiraTokens reads and decrypts stored tokens</li><li>Refresh-JiraToken uses refresh_token to get new access_token</li><li>Get-JiraAccessToken is the main function scripts call</li><li>Access tokens expire every hour \u2014 refresh tokens last longer</li></ul>",
                    description: "<h4>Token Storage Functions</h4><p>OAuth tokens expire. Access tokens last ~1 hour. Refresh tokens last much longer. Our module handles this automatically: every script calls <code>Get-JiraAccessToken</code>, which silently refreshes if needed.</p><p><strong>Instructions:</strong> Add these functions to <code>JiraAuth.psm1</code> below the encryption functions from the previous section.</p><p><strong>Flow:</strong> Script calls Get-JiraAccessToken \u2192 calls Refresh-JiraToken \u2192 sends refresh_token to Atlassian \u2192 gets new access_token \u2192 saves encrypted \u2192 returns token to script.</p>",
                    syntax: "# In any script, get a valid token with one line:\n$accessToken = Get-JiraAccessToken",
                    script: "The beauty of this design: every script just calls Get-JiraAccessToken and gets a working token. They never think about expiration, refresh flows, or encryption. It just works.\n\nKey point: The refresh_token is what makes this possible. Without offline_access scope, you would have to re-login every hour.",
                    examples: [
                        {
                            name: "JiraAuth.psm1 - Part 2: Token Functions",
                            code: "# ==============================================\n# JiraAuth.psm1 - Part 2: Token Storage & Refresh\n# Add these functions BELOW the encryption functions\n# ==============================================\n\nfunction Save-JiraTokens {\n    param([Parameter(Mandatory)] $Tokens)\n\n    # Convert token object to JSON, then encrypt\n    $json = $Tokens | ConvertTo-Json -Depth 10\n    $cipher = Encrypt-Data -PlainText $json\n\n    # Store encrypted string to file\n    Set-Content -Path $global:JiraConfig.TokenFile -Value $cipher -Encoding UTF8\n}\n\nfunction Get-JiraTokens {\n    try {\n        if (-not (Test-Path $global:JiraConfig.TokenFile)) {\n            return $null\n        }\n        $cipher = Get-Content $global:JiraConfig.TokenFile -Raw\n        if ([string]::IsNullOrWhiteSpace($cipher)) {\n            return $null\n        }\n        $json = Decrypt-Data -CipherText $cipher\n        return ($json | ConvertFrom-Json)\n    }\n    catch {\n        return $null\n    }\n}\n\nfunction Refresh-JiraToken {\n    $tokens = Get-JiraTokens\n    if (-not $tokens) { return $null }\n\n    # Exchange refresh_token for new access_token\n    $body = @{\n        grant_type    = \"refresh_token\"\n        client_id     = $global:JiraConfig.ClientId\n        client_secret = $global:JiraConfig.ClientSecret\n        refresh_token = $tokens.refresh_token\n    }\n\n    $resp = Invoke-RestMethod -Uri \"https://auth.atlassian.com/oauth/token\" `\n        -Method Post -Body $body `\n        -ContentType \"application/x-www-form-urlencoded\"\n\n    # Save new tokens (includes new refresh_token)\n    Save-JiraTokens -Tokens $resp\n    return $resp.access_token\n}\n\nfunction Get-JiraAccessToken {\n    # Every script calls this - it handles refresh automatically\n    return Refresh-JiraToken\n}"
                        }
                    ]
                },
                {
                    id: "m7s3",
                    title: "7.3 Initial OAuth Login",
                    showEditor: true,
                    brief: "<ul><li>OAuth 2.0 Authorization Code flow</li><li>Run ONCE to get initial tokens</li><li>Opens a browser URL for user consent</li><li>User pastes back the authorization code</li><li>Script exchanges code for access + refresh tokens</li><li>After this, refresh flow handles everything automatically</li></ul>",
                    description: "<h4>Initial OAuth Login</h4><p>This script runs <strong>once</strong> to establish the initial connection. It opens a URL in your browser, you log in and grant permission, then paste the authorization code back into PowerShell.</p><p><strong>Instructions:</strong> Create <code>D:\\JiraAutomation\\JiraAuth\\Init-JiraAuth.ps1</code></p><p><strong>After running this once:</strong> You never need to run it again (unless tokens fully expire). The refresh flow in JiraAuth.psm1 handles everything from here.</p>",
                    syntax: "# OAuth 2.0 Authorization Code Flow:\n# 1. Script generates auth URL\n# 2. User opens URL in browser, logs in\n# 3. Browser redirects to localhost with ?code=xxx\n# 4. User copies the code value\n# 5. Script exchanges code for tokens\n# 6. Tokens saved encrypted to disk",
                    script: "Run this live if possible. Show the browser redirect, copy the code from the URL bar. Common issues:\n1. Redirect shows 'page not found' - that is NORMAL, just copy the code from the URL\n2. Code expires in 60 seconds - be quick!\n3. If it fails, just run it again\n\nPresenter note: Run this ONCE to get your initial tokens. After that, the refresh flow handles everything.",
                    examples: [
                        {
                            name: "Init-JiraAuth.ps1",
                            code: "# ==============================================\n# Init-JiraAuth.ps1 - Run ONCE for initial OAuth login\n# Create this file: D:\\JiraAutomation\\JiraAuth\\Init-JiraAuth.ps1\n# ==============================================\n\nImport-Module \"D:\\JiraAutomation\\JiraAuth\\JiraAuth.psm1\" -Force\n\n$clientId     = $global:JiraConfig.ClientId\n$clientSecret = $global:JiraConfig.ClientSecret\n$redirectUri  = $global:JiraConfig.RedirectUri\n$scope        = \"write:jira-work manage:jira-project read:jira-user read:jira-work offline_access\"\n\n$encodedRedirect = [uri]::EscapeDataString($redirectUri)\n$encodedScope    = $scope -replace ' ', '%20'\n\n# Build the authorization URL\n$authUrl = \"https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=$clientId&scope=$encodedScope&redirect_uri=$encodedRedirect&response_type=code&prompt=consent\"\n\nWrite-Host \"`nOpen this link in your browser:\" -ForegroundColor Yellow\nWrite-Host $authUrl\nWrite-Host \"`nAfter logging in, you will be redirected to a page that may show an error.\"\nWrite-Host \"That is NORMAL. Copy the 'code' value from the URL bar.\" -ForegroundColor Cyan\nWrite-Host \"Example: https://localhost?code=THIS_PART_HERE`n\"\n\n$code = Read-Host \"Paste the 'code' value here\"\n\n# Exchange authorization code for tokens\n$body = @{\n    grant_type    = \"authorization_code\"\n    client_id     = $clientId\n    client_secret = $clientSecret\n    code          = $code\n    redirect_uri  = $redirectUri\n}\n\n$resp = Invoke-RestMethod -Uri \"https://auth.atlassian.com/oauth/token\" `\n    -Method Post -Body $body `\n    -ContentType \"application/x-www-form-urlencoded\"\n\n# Save tokens encrypted via our module\nSave-JiraTokens -Tokens $resp\n\nWrite-Host \"`nOAuth tokens saved successfully!\" -ForegroundColor Green\nWrite-Host \"You can now use Get-JiraAccessToken in any script.\""
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 8: Querying Jira Tickets",
            sections: [
                {
                    id: "m8s1",
                    title: "8.1 Your First Jira Query",
                    showEditor: true,
                    brief: "<ul><li>Import the auth module to get a valid token</li><li>Build headers with Bearer token</li><li>Use JQL (Jira Query Language) to filter tickets</li><li>Call the /search/jql endpoint</li><li>Parse the response to extract ticket details</li><li>Display results in a formatted table</li></ul>",
                    description: "<h4>Your First Jira Query</h4><p>This is the moment everything comes together. We import our auth module, get a token, build a JQL query, call the Jira API, and display the results.</p><p><strong>Instructions:</strong> Create <code>D:\\JiraAutomation\\Scripts\\Get-OpenDBATickets.ps1</code></p><p><strong>How it works:</strong></p><ol><li>Import JiraAuth.psm1 (gives us Get-JiraAccessToken)</li><li>Get a valid access token (auto-refreshes if expired)</li><li>Build the JQL query string</li><li>URL-encode the JQL (spaces and special chars break URLs)</li><li>Call the search endpoint</li><li>Parse response.issues array</li><li>Format output as a table</li></ol>",
                    syntax: "# Jira Search API endpoint:\n# GET /rest/api/3/search/jql?jql={encoded_jql}&fields={field_list}\n\n# Base URL pattern:\n# https://api.atlassian.com/ex/jira/{cloudId}/rest/api/3/...",
                    script: "This is the big payoff moment. Run this live and show real tickets appearing in the terminal. The visual impact of seeing your actual Jira tickets in PowerShell is powerful.\n\nExplain each part: Import module \u2192 get token \u2192 build query \u2192 call API \u2192 parse response \u2192 display. This exact pattern repeats for every Jira script.",
                    examples: [
                        {
                            name: "Get-OpenDBATickets.ps1",
                            code: "# ==============================================\n# Get-OpenDBATickets.ps1 - Query open Jira tickets\n# Create: D:\\JiraAutomation\\Scripts\\Get-OpenDBATickets.ps1\n# ==============================================\n\n# Step 1: Import the auth module\nImport-Module \"D:\\JiraAutomation\\JiraAuth\\JiraAuth.psm1\" -Force\n\n# Step 2: Get a valid access token (auto-refreshes)\n$accessToken = Get-JiraAccessToken\n\n# Step 3: Build headers for the API call\n$headers = @{\n    \"Authorization\" = \"Bearer $accessToken\"\n    \"Accept\"        = \"application/json\"\n}\n\n# Step 4: Build JQL query (Jira Query Language)\n$jql = \"project = KAN AND statusCategory != Done ORDER BY created DESC\"\n$encodedJql = [uri]::EscapeDataString($jql)\n\n# Step 5: Call the Jira Search API\n$apiUrl = \"https://api.atlassian.com/ex/jira/$($global:JiraConfig.CloudId)/rest/api/3/search/jql?jql=$encodedJql&fields=key,summary,status,assignee,created\"\n$response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Get\n\n# Step 6: Parse and display results\nWrite-Host \"Open tickets found: $($response.total)\" -ForegroundColor Green\n\n$response.issues | Select-Object key,\n    @{n='Summary';e={$_.fields.summary}},\n    @{n='Status';e={$_.fields.status.name}},\n    @{n='Assignee';e={$_.fields.assignee.displayName}},\n    @{n='Created';e={$_.fields.created}} |\nFormat-Table -AutoSize"
                        }
                    ]
                },
                {
                    id: "m8s2",
                    title: "8.2 Understanding JQL",
                    showEditor: true,
                    brief: "<ul><li>JQL = Jira Query Language (like SQL for Jira)</li><li>Filter by project, status, assignee, priority, dates</li><li>Use AND/OR to combine conditions</li><li>ORDER BY to sort results</li><li>Functions: currentUser(), startOfDay(), endOfWeek()</li><li>statusCategory groups statuses (To Do, In Progress, Done)</li></ul>",
                    description: "<h4>Understanding JQL</h4><p>JQL (Jira Query Language) is how you tell Jira exactly which tickets you want. It is like SQL but for Jira. Master JQL and you can query anything.</p><p><strong>Key concepts:</strong></p><ul><li><code>project = KAN</code> \u2014 filter by project</li><li><code>statusCategory != Done</code> \u2014 all non-completed tickets</li><li><code>assignee = currentUser()</code> \u2014 your tickets</li><li><code>created >= -7d</code> \u2014 created in last 7 days</li><li><code>ORDER BY created DESC</code> \u2014 newest first</li></ul>",
                    syntax: "# JQL Syntax:\n# field operator value [AND/OR field operator value]\n# Operators: =, !=, >, <, >=, <=, ~(contains), IN, NOT IN\n# Functions: currentUser(), startOfDay(), now()",
                    script: "JQL is incredibly powerful. Show multiple examples and let students modify them. The key insight: anything you can filter in the Jira UI, you can express in JQL. Encourage students to test JQL in Jira's search bar first, then copy it into their scripts.",
                    examples: [
                        {
                            name: "JQL Examples",
                            code: "# JQL (Jira Query Language) - Different query examples\n# Test these in Jira's search bar first, then use in scripts\n\n# All open tickets in a project\n$jql1 = \"project = KAN AND statusCategory != Done ORDER BY created DESC\"\n\n# My tickets that are in progress\n$jql2 = \"assignee = currentUser() AND status = 'In Progress'\"\n\n# Tickets created in the last 7 days\n$jql3 = \"project = KAN AND created >= -7d\"\n\n# High priority tickets still open\n$jql4 = \"priority = High AND statusCategory != Done\"\n\n# Unassigned tickets (need attention!)\n$jql5 = \"project = KAN AND assignee is EMPTY AND statusCategory != Done\"\n\n# Tickets updated today\n$jql6 = \"project = KAN AND updated >= startOfDay()\"\n\n# Combine multiple conditions\n$jql7 = \"project = KAN AND priority IN (High, Critical) AND status != Done ORDER BY priority DESC\"\n\n# Text search in summary\n$jql8 = \"project = KAN AND summary ~ 'database' ORDER BY created DESC\"\n\n# Display all examples\nWrite-Host \"=== JQL Query Examples ===\" -ForegroundColor Cyan\nWrite-Host \"1. Open tickets:     $jql1\"\nWrite-Host \"2. My in-progress:   $jql2\"\nWrite-Host \"3. Last 7 days:      $jql3\"\nWrite-Host \"4. High priority:    $jql4\"\nWrite-Host \"5. Unassigned:       $jql5\"\nWrite-Host \"6. Updated today:    $jql6\"\nWrite-Host \"7. High + Critical:  $jql7\"\nWrite-Host \"8. Text search:      $jql8\"\n\nWrite-Host \"`nTip: Test JQL in Jira's search bar before using in scripts!\" -ForegroundColor Yellow"
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 9: Creating & Updating Tickets",
            sections: [
                {
                    id: "m9s1",
                    title: "9.1 Creating a New Ticket",
                    showEditor: true,
                    brief: "<ul><li>POST request to /rest/api/3/issue</li><li>Body contains: project key, summary, issue type, description</li><li>Description uses Atlassian Document Format (ADF)</li><li>ADF is a nested JSON structure for rich text</li><li>Response returns the new ticket key (e.g., KAN-15)</li></ul>",
                    description: "<h4>Creating a New Ticket</h4><p>Creating a ticket via API uses a POST request with a JSON body. The tricky part is the <strong>description field</strong> \u2014 Jira v3 uses Atlassian Document Format (ADF), which is a nested JSON structure.</p><p><strong>Instructions:</strong> Create <code>D:\\JiraAutomation\\Scripts\\Create-NewTicket.ps1</code></p><p><strong>Key points:</strong></p><ul><li>Project key identifies which project (e.g., \"KAN\")</li><li>Issue type: Task, Bug, Story, Epic</li><li>Description must be in ADF format (not plain text!)</li></ul>",
                    syntax: "# POST /rest/api/3/issue\n# Body: { fields: { project, summary, issuetype, description } }\n# Response: { id, key, self }",
                    script: "The ADF format is confusing at first. Explain it as: a document contains paragraphs, paragraphs contain text nodes. Show the structure visually. The good news: once you have the template, you just change the text values.\n\nRun this live and show the new ticket appearing in Jira. Students love seeing their code create real tickets.",
                    examples: [
                        {
                            name: "Create-NewTicket.ps1",
                            code: "# ==============================================\n# Create-NewTicket.ps1 - Create a Jira ticket via API\n# Create: D:\\JiraAutomation\\Scripts\\Create-NewTicket.ps1\n# ==============================================\n\nImport-Module \"D:\\JiraAutomation\\JiraAuth\\JiraAuth.psm1\" -Force\n\n$accessToken = Get-JiraAccessToken\n$cloudId     = $global:JiraConfig.CloudId\n\n$headers = @{\n    Authorization  = \"Bearer $accessToken\"\n    Accept         = \"application/json\"\n    \"Content-Type\" = \"application/json\"\n}\n\n# Build the ticket body\n# Note: Description uses Atlassian Document Format (ADF)\n$body = @{\n    fields = @{\n        project   = @{ key = \"KAN\" }\n        summary   = \"New Issue from PowerShell\"\n        issuetype = @{ name = \"Task\" }\n        description = @{\n            type    = \"doc\"\n            version = 1\n            content = @(\n                @{\n                    type    = \"paragraph\"\n                    content = @(\n                        @{ type = \"text\"; text = \"Created via PowerShell API automation.\" }\n                    )\n                }\n            )\n        }\n    }\n} | ConvertTo-Json -Depth 10\n\n# POST to create the issue\n$url = \"https://api.atlassian.com/ex/jira/$cloudId/rest/api/3/issue\"\n$response = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body\n\nWrite-Host \"Issue created: $($response.key)\" -ForegroundColor Green\nWrite-Host \"URL: $($global:JiraConfig.SiteUrl)/browse/$($response.key)\""
                        }
                    ]
                },
                {
                    id: "m9s2",
                    title: "9.2 Adding Comments to a Ticket",
                    showEditor: true,
                    brief: "<ul><li>POST request to /rest/api/3/issue/{key}/comment</li><li>Comment body also uses ADF format</li><li>Wrap text in doc \u2192 paragraph \u2192 text structure</li><li>Useful for automated status updates and audit trails</li><li>Error handling with try/catch</li></ul>",
                    description: "<h4>Adding Comments to a Ticket</h4><p>Adding comments programmatically is great for audit trails. Every time your automation does something (assigns a ticket, changes status), it can leave a comment explaining what happened and why.</p><p><strong>Instructions:</strong> Create <code>D:\\JiraAutomation\\Scripts\\Update-TicketComment.ps1</code></p><p><strong>Use cases:</strong></p><ul><li>\"Auto-assigned to John based on component: Database\"</li><li>\"SLA warning: 4 hours remaining\"</li><li>\"Status changed to In Progress by automation\"</li></ul>",
                    syntax: "# POST /rest/api/3/issue/{issueKey}/comment\n# Body: { body: { type: \"doc\", version: 1, content: [...] } }",
                    script: "Show this creating a real comment on a ticket. Then open Jira and show the comment appeared. The ADF structure is the same as the description field \u2014 once you learn it, you use it everywhere.\n\nNote the try/catch error handling. API calls can fail (network issues, permissions, invalid ticket key). Always wrap in try/catch for production scripts.",
                    examples: [
                        {
                            name: "Update-TicketComment.ps1",
                            code: "# ==============================================\n# Update-TicketComment.ps1 - Add a comment to a Jira ticket\n# Create: D:\\JiraAutomation\\Scripts\\Update-TicketComment.ps1\n# ==============================================\n\nImport-Module \"D:\\JiraAutomation\\JiraAuth\\JiraAuth.psm1\" -Force\n\nfunction Add-JiraComment {\n    param(\n        [Parameter(Mandatory)]\n        [string]$IssueKey,\n\n        [Parameter(Mandatory)]\n        [string]$CommentText\n    )\n\n    $accessToken = Get-JiraAccessToken\n    $cloudId     = $global:JiraConfig.CloudId\n\n    $headers = @{\n        Authorization  = \"Bearer $accessToken\"\n        Accept         = \"application/json\"\n        \"Content-Type\" = \"application/json\"\n    }\n\n    # Comment body in Atlassian Document Format (ADF)\n    $body = @{\n        body = @{\n            type    = \"doc\"\n            version = 1\n            content = @(\n                @{\n                    type    = \"paragraph\"\n                    content = @(\n                        @{\n                            type = \"text\"\n                            text = $CommentText\n                        }\n                    )\n                }\n            )\n        }\n    } | ConvertTo-Json -Depth 10\n\n    $url = \"https://api.atlassian.com/ex/jira/$cloudId/rest/api/3/issue/$IssueKey/comment\"\n\n    try {\n        Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body\n        Write-Host \"Comment added to $IssueKey\" -ForegroundColor Green\n    }\n    catch {\n        Write-Host \"Error adding comment: $($_.ErrorDetails.Message)\" -ForegroundColor Red\n    }\n}\n\n# Usage:\nAdd-JiraComment -IssueKey \"KAN-5\" -CommentText \"Automated update: Script executed successfully.\""
                        }
                    ]
                },
                {
                    id: "m9s3",
                    title: "9.3 Changing Ticket Assignee",
                    showEditor: true,
                    brief: "<ul><li>Two-step process: find user, then assign</li><li>Search users by display name via /user/search</li><li>Get the accountId from search results</li><li>PUT request to /issue/{key}/assignee with accountId</li><li>ValidateSet restricts input to known team members (optional)</li></ul>",
                    description: "<h4>Changing Ticket Assignee</h4><p>Reassigning tickets requires two API calls: first find the user's <code>accountId</code> by searching their name, then PUT that ID to the assignee endpoint.</p><p><strong>Instructions:</strong> Create <code>D:\\JiraAutomation\\Scripts\\Change-Assignee.ps1</code></p><p><strong>Why two calls?</strong> Jira uses internal account IDs (not names or emails) for assignment. You cannot just pass a name \u2014 you must look up the ID first.</p>",
                    syntax: "# Step 1: GET /user/search?query={name}\n# Step 2: PUT /issue/{key}/assignee  Body: { accountId: \"...\" }",
                    script: "The two-step pattern (search then update) is common in APIs. Show what happens if you try to assign by name directly (it fails). Then show the proper flow: search \u2192 get accountId \u2192 assign.\n\nDemo: Reassign a ticket live and show it change in Jira.",
                    examples: [
                        {
                            name: "Change-Assignee.ps1",
                            code: "# ==============================================\n# Change-Assignee.ps1 - Reassign a Jira ticket\n# Create: D:\\JiraAutomation\\Scripts\\Change-Assignee.ps1\n# ==============================================\n\nImport-Module \"D:\\JiraAutomation\\JiraAuth\\JiraAuth.psm1\" -Force\n\nfunction Set-JiraAssignee {\n    param(\n        [Parameter(Mandatory)]\n        [string]$TicketKey,\n\n        [Parameter(Mandatory)]\n        [string]$Assignee   # Display name (e.g., \"John Mathew\")\n    )\n\n    $accessToken = Get-JiraAccessToken\n    $cloudId     = $global:JiraConfig.CloudId\n\n    $headers = @{\n        Authorization  = \"Bearer $accessToken\"\n        Accept         = \"application/json\"\n        \"Content-Type\" = \"application/json\"\n    }\n\n    # Step 1: Search for the user by name\n    $encodedName = [uri]::EscapeDataString($Assignee)\n    $searchUrl = \"https://api.atlassian.com/ex/jira/$cloudId/rest/api/3/user/search?query=$encodedName\"\n    $users = Invoke-RestMethod -Uri $searchUrl -Headers $headers -Method GET\n\n    if (-not $users) {\n        Write-Host \"No matching user found for '$Assignee'\" -ForegroundColor Red\n        return\n    }\n\n    # Find exact match by display name\n    $user = $users | Where-Object { $_.displayName -eq $Assignee } | Select-Object -First 1\n\n    if (-not $user) {\n        Write-Host \"No exact match for '$Assignee'. Found:\" -ForegroundColor Yellow\n        $users | ForEach-Object { Write-Host \"  - $($_.displayName)\" }\n        return\n    }\n\n    $accountId = $user.accountId\n\n    # Step 2: Assign the ticket\n    $body = @{ accountId = $accountId } | ConvertTo-Json\n    $assignUrl = \"https://api.atlassian.com/ex/jira/$cloudId/rest/api/3/issue/$TicketKey/assignee\"\n\n    try {\n        Invoke-RestMethod -Uri $assignUrl -Method PUT -Headers $headers -Body $body\n        Write-Host \"Successfully assigned $TicketKey to $Assignee\" -ForegroundColor Green\n    }\n    catch {\n        Write-Host \"Failed to assign $TicketKey: $($_.Exception.Message)\" -ForegroundColor Red\n    }\n}\n\n# Usage:\n# Set-JiraAssignee -TicketKey \"KAN-11\" -Assignee \"Maxwell\""
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 10: Ticket Status Transitions",
            sections: [
                {
                    id: "m10s1",
                    title: "10.1 Understanding Jira Workflows",
                    showEditor: false,
                    brief: "<ul><li>Jira tickets move through statuses via transitions</li><li>Each transition has a unique ID</li><li>You cannot jump directly to any status \u2014 only available transitions</li><li>Common flow: To Do \u2192 In Progress \u2192 In Review \u2192 Done</li><li>Must query available transitions first, then apply one</li><li>Different ticket types may have different workflows</li></ul>",
                    description: "<h4>Understanding Jira Workflows</h4><p>In Jira, tickets do not just have a status \u2014 they have a <strong>workflow</strong>. A workflow defines which statuses exist and which <strong>transitions</strong> are allowed between them.</p><p><strong>Key concept:</strong> You cannot set a ticket's status directly. You must <em>transition</em> it. Each transition has an ID, and only certain transitions are available from the current status.</p><p><strong>Example workflow:</strong></p><pre>To Do \u2192 In Progress \u2192 In Review \u2192 Done\n  \u2502                              \u2502\n  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518 (can go back)</pre><p><strong>API approach:</strong></p><ol><li>GET <code>/issue/{key}/transitions</code> \u2014 see what transitions are available</li><li>Find the transition whose name matches your target status</li><li>POST <code>/issue/{key}/transitions</code> with the transition ID</li></ol>",
                    syntax: "",
                    script: "Draw the workflow on a whiteboard. Show that from 'To Do' you can only go to 'In Progress' (not directly to 'Done'). This is why we query transitions first \u2014 the available options depend on current status.\n\nCommon confusion: Students try to PUT a status directly. That does not work. You must use the transitions endpoint.",
                    examples: []
                },
                {
                    id: "m10s2",
                    title: "10.2 Changing Ticket Status",
                    showEditor: true,
                    brief: "<ul><li>GET available transitions for the ticket</li><li>Match transition name to target status</li><li>POST the transition ID to move the ticket</li><li>ValidateSet restricts input to known statuses</li><li>Shows available transitions if target is not valid</li></ul>",
                    description: "<h4>Changing Ticket Status</h4><p>This script transitions a ticket to a new status. It first queries available transitions, finds the matching one, then applies it.</p><p><strong>Instructions:</strong> Create <code>D:\\JiraAutomation\\Scripts\\Change-TicketStatus.ps1</code></p><p><strong>The pattern:</strong></p><ol><li>Query: \"What transitions can I do from the current status?\"</li><li>Find: Match the target status name to a transition</li><li>Apply: POST the transition ID</li></ol>",
                    syntax: "# GET /issue/{key}/transitions  -> list available transitions\n# POST /issue/{key}/transitions  Body: { transition: { id: \"31\" } }",
                    script: "Run this live. Show a ticket moving from 'To Do' to 'In Progress' and verify in Jira. Then try an invalid transition (like going from 'To Do' directly to 'Done') and show the helpful error message listing available options.\n\nThe ValidateSet parameter is a nice touch \u2014 it gives tab-completion in PowerShell for the allowed statuses.",
                    examples: [
                        {
                            name: "Change-TicketStatus.ps1",
                            code: "# ==============================================\n# Change-TicketStatus.ps1 - Transition a ticket to a new status\n# Create: D:\\JiraAutomation\\Scripts\\Change-TicketStatus.ps1\n# ==============================================\n\nImport-Module \"D:\\JiraAutomation\\JiraAuth\\JiraAuth.psm1\" -Force\n\nfunction Set-JiraTicketStatus {\n    param(\n        [Parameter(Mandatory)]\n        [string]$TicketKey,\n\n        [Parameter(Mandatory)]\n        [ValidateSet(\"IDEA\", \"In Progress\", \"Done\", \"In Review\", \"Resolved\")]\n        [string]$TargetStatus\n    )\n\n    $accessToken = Get-JiraAccessToken\n    $cloudId     = $global:JiraConfig.CloudId\n\n    $headers = @{\n        Authorization  = \"Bearer $accessToken\"\n        Accept         = \"application/json\"\n        \"Content-Type\" = \"application/json\"\n    }\n\n    # Step 1: Get available transitions for this ticket\n    $transitionsUrl = \"https://api.atlassian.com/ex/jira/$cloudId/rest/api/3/issue/$TicketKey/transitions\"\n    $transitionResponse = Invoke-RestMethod -Uri $transitionsUrl -Headers $headers -Method GET\n\n    # Step 2: Find the transition matching our target status\n    $transition = $transitionResponse.transitions | Where-Object { $_.name -eq $TargetStatus }\n\n    if (-not $transition) {\n        Write-Host \"'$TargetStatus' is not available for $TicketKey.\" -ForegroundColor Red\n        Write-Host \"Available transitions:\" -ForegroundColor Yellow\n        $transitionResponse.transitions | Select-Object name, id | Format-Table\n        return\n    }\n\n    # Step 3: Apply the transition\n    $body = @{\n        transition = @{ id = $transition.id }\n    } | ConvertTo-Json\n\n    $updateUrl = \"https://api.atlassian.com/ex/jira/$cloudId/rest/api/3/issue/$TicketKey/transitions\"\n    Invoke-RestMethod -Uri $updateUrl -Method POST -Headers $headers -Body $body\n\n    Write-Host \"Ticket $TicketKey moved to '$TargetStatus'.\" -ForegroundColor Green\n}\n\n# Usage:\n# Set-JiraTicketStatus -TicketKey \"KAN-12\" -TargetStatus \"In Progress\""
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 11: Email Reporting",
            sections: [
                {
                    id: "m11s1",
                    title: "11.1 Building HTML Reports",
                    showEditor: true,
                    brief: "<ul><li>ConvertTo-Html turns PowerShell objects into HTML tables</li><li>-Fragment creates just the table (no full HTML page)</li><li>-PreContent adds a heading above the table</li><li>-PostContent adds content below</li><li>Add CSS styling for professional appearance</li><li>Combine with ticket data for email-ready reports</li></ul>",
                    description: "<h4>Building HTML Reports</h4><p>PowerShell can convert any object collection into an HTML table with <code>ConvertTo-Html</code>. Add CSS styling and you get professional-looking reports ready for email.</p><p><strong>Instructions:</strong> This is the first part of our alert script. We will combine this with email sending in the next section.</p>",
                    syntax: "# Convert objects to HTML table\n$objects | ConvertTo-Html -Fragment -Property Col1, Col2\n\n# With pre/post content\n$objects | ConvertTo-Html -Fragment `\n    -PreContent \"<h2>Title</h2>\" `\n    -PostContent \"<p>Footer</p>\"",
                    script: "Show the raw HTML output first (ugly), then add CSS styling (professional). The visual transformation is impressive. Explain that -Fragment gives just the table, not a full HTML page \u2014 we wrap it in our own styled template.\n\nTip: Open the HTML output in a browser to preview how the email will look.",
                    examples: [
                        {
                            name: "HTML Report Generation",
                            code: "# Build an HTML report from ticket data\n# This is the pattern used in Alert_AllTickets.ps1\n\n# Sample ticket data (in real script, this comes from Jira API)\n$tickets = @(\n    [PSCustomObject]@{ Key=\"KAN-1\"; Summary=\"Fix login bug\"; Status=\"In Progress\"; Assignee=\"John\"; Created=\"2024-01-15\" }\n    [PSCustomObject]@{ Key=\"KAN-2\"; Summary=\"Update dashboard\"; Status=\"To Do\"; Assignee=\"Sarah\"; Created=\"2024-01-16\" }\n    [PSCustomObject]@{ Key=\"KAN-3\"; Summary=\"Database backup\"; Status=\"In Review\"; Assignee=\"Mike\"; Created=\"2024-01-17\" }\n)\n\n# Convert to HTML table with styling\n$htmlTable = $tickets | ConvertTo-Html -Fragment `\n    -Property Key, Summary, Status, Assignee, Created `\n    -PreContent \"<h2>Open Jira Tickets (KAN)</h2>\" `\n    -PostContent \"<br><b>Total Tickets:</b> $($tickets.Count)\"\n\n# Wrap in styled HTML\n$htmlBody = @\"\n<style>\nbody { font-family: Arial, sans-serif; }\ntable { border-collapse: collapse; width: 100%; }\nth { background-color: #1a73e8; color: white; padding: 8px; text-align: left; }\ntd { border: 1px solid #ddd; padding: 8px; }\ntr:nth-child(even) { background-color: #f2f2f2; }\ntr:hover { background-color: #ddd; }\n</style>\n$htmlTable\n\"@\n\nWrite-Host \"=== HTML Report Generated ===\" -ForegroundColor Green\nWrite-Host \"Table rows: $($tickets.Count)\"\nWrite-Host \"`nPreview (raw HTML):\"\nWrite-Host $htmlBody.Substring(0, 200)\nWrite-Host \"...\"\n\n# Save to file to preview in browser\n# $htmlBody | Out-File \"D:\\JiraAutomation\\Scripts\\report_preview.html\"\n# Start-Process \"D:\\JiraAutomation\\Scripts\\report_preview.html\""
                        }
                    ]
                },
                {
                    id: "m11s2",
                    title: "11.2 Sending Emails via Gmail SMTP",
                    showEditor: true,
                    brief: "<ul><li>Send-MailMessage sends emails from PowerShell</li><li>Gmail SMTP: smtp.gmail.com, port 587, SSL required</li><li>Use Gmail App Password (NOT your real password)</li><li>App Password: Google Account \u2192 Security \u2192 2FA \u2192 App Passwords</li><li>-BodyAsHtml flag sends HTML content</li><li>ConvertTo-SecureString protects the password in memory</li></ul>",
                    description: "<h4>Sending Emails via Gmail SMTP</h4><p>PowerShell's <code>Send-MailMessage</code> cmdlet sends emails through any SMTP server. We use Gmail because it is free and most people have an account.</p><p><strong>Gmail App Password Setup:</strong></p><ol><li>Go to Google Account \u2192 Security</li><li>Enable 2-Factor Authentication (required)</li><li>Go to App Passwords (search for it in account settings)</li><li>Create a new app password for \"Mail\"</li><li>Copy the 16-character password</li></ol><p><strong>Important:</strong> This is NOT your Gmail password. It is a separate 16-character code that only works for SMTP.</p>",
                    syntax: "Send-MailMessage -From $from -To $to `\n    -Subject $subject -Body $htmlBody `\n    -BodyAsHtml -SmtpServer \"smtp.gmail.com\" `\n    -Credential $cred -UseSsl -Port 587",
                    script: "Walk through the Gmail App Password setup. This is where students get stuck most often. Key points:\n1. 2FA must be enabled FIRST\n2. App Passwords is a separate setting (not the same as 2FA)\n3. The 16-char password is shown ONCE - copy it immediately\n4. Send-MailMessage is deprecated in PS 7+ but still works. Alternative: use the MailKit library.\n\nSend a test email live to show it works.",
                    examples: [
                        {
                            name: "Send Email via Gmail",
                            code: "# ==============================================\n# Sending emails via Gmail SMTP\n# Setup: Google Account > Security > 2FA > App Passwords\n# ==============================================\n\n# Gmail SMTP Configuration\n$from    = \"your.email@gmail.com\"       # Your Gmail address\n$to      = \"recipient@example.com\"      # Who receives the report\n$subject = \"Open Jira Tickets Report - KAN\"\n\n# Gmail App Password (16-character code from Google)\n# NOT your real Gmail password!\n$gmailAppPassword = \"xxxx xxxx xxxx xxxx\"   # Replace with your app password\n\n# Create secure credential object\n$securePwd = ConvertTo-SecureString $gmailAppPassword -AsPlainText -Force\n$cred = New-Object System.Management.Automation.PSCredential ($from, $securePwd)\n\n# Sample HTML body (in real script, this comes from ConvertTo-Html)\n$htmlBody = \"<h2>Test Email</h2><p>If you see this, SMTP is working!</p>\"\n\n# Send the email\ntry {\n    Send-MailMessage -From $from `\n        -To $to `\n        -Subject $subject `\n        -Body $htmlBody `\n        -BodyAsHtml `\n        -SmtpServer \"smtp.gmail.com\" `\n        -Credential $cred `\n        -UseSsl `\n        -Port 587\n\n    Write-Host \"Email sent successfully!\" -ForegroundColor Green\n}\ncatch {\n    Write-Host \"Failed to send email: $($_.Exception.Message)\" -ForegroundColor Red\n    Write-Host \"`nCommon fixes:\"\n    Write-Host \"  1. Enable 2FA on your Google account\"\n    Write-Host \"  2. Generate an App Password (not your real password)\"\n    Write-Host \"  3. Check that 'Less secure apps' is not blocking you\"\n}"
                        }
                    ]
                },
                {
                    id: "m11s3",
                    title: "11.3 Complete Alert Script",
                    showEditor: true,
                    brief: "<ul><li>Combines: Jira query + HTML report + email sending</li><li>One script that does everything end-to-end</li><li>Handles empty results gracefully</li><li>Professional HTML styling with alternating row colors</li><li>Ready to be scheduled for daily execution</li></ul>",
                    description: "<h4>Complete Alert Script</h4><p>This is the capstone script \u2014 it combines everything: query Jira for open tickets, build a styled HTML report, and email it. This is what runs daily on a schedule.</p><p><strong>Instructions:</strong> Create <code>D:\\JiraAutomation\\Scripts\\Alert_AllTickets.ps1</code></p><p><strong>Flow:</strong> Import module \u2192 Get token \u2192 Query tickets \u2192 Build HTML \u2192 Send email</p>",
                    syntax: "# Complete flow:\n# 1. Import-Module JiraAuth\n# 2. Query Jira API with JQL\n# 3. Parse response into objects\n# 4. ConvertTo-Html with styling\n# 5. Send-MailMessage with HTML body",
                    script: "This is the grand finale of the automation scripts. Run it live and show the email arriving in the inbox with a beautifully formatted table of tickets.\n\nPoint out how every piece we built separately (auth, query, HTML, email) comes together in one clean script. This is the power of modular design.",
                    examples: [
                        {
                            name: "Alert_AllTickets.ps1",
                            code: "# ==============================================\n# Alert_AllTickets.ps1 - Full ticket report via email\n# Create: D:\\JiraAutomation\\Scripts\\Alert_AllTickets.ps1\n# ==============================================\n\n# --- Step 1: Import auth module ---\nImport-Module \"D:\\JiraAutomation\\JiraAuth\\JiraAuth.psm1\" -Force\n\n$accessToken = Get-JiraAccessToken\n$headers = @{\n    \"Authorization\" = \"Bearer $accessToken\"\n    \"Accept\"        = \"application/json\"\n}\n\n# --- Step 2: Query open tickets ---\n$jql = \"project = KAN AND statusCategory != Done ORDER BY created DESC\"\n$encodedJql = [uri]::EscapeDataString($jql)\n$apiUrl = \"https://api.atlassian.com/ex/jira/$($global:JiraConfig.CloudId)/rest/api/3/search/jql?jql=$encodedJql&fields=key,summary,status,assignee,created\"\n$response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Get\n\n# --- Step 3: Parse into clean objects ---\n$tickets = $response.issues | ForEach-Object {\n    [PSCustomObject]@{\n        Key      = $_.key\n        Summary  = $_.fields.summary\n        Status   = $_.fields.status.name\n        Assignee = $_.fields.assignee.displayName\n        Created  = (Get-Date $_.fields.created -Format \"yyyy-MM-dd HH:mm\")\n    }\n}\n\n# --- Step 4: Build HTML email body ---\nif ($tickets.Count -eq 0) {\n    $htmlBody = \"<h3>No open tickets found! All clear.</h3>\"\n} else {\n    $htmlTable = $tickets | ConvertTo-Html -Fragment `\n        -Property Key, Summary, Status, Assignee, Created `\n        -PreContent \"<h2>Open Jira Tickets (KAN)</h2>\" `\n        -PostContent \"<br><b>Total Tickets:</b> $($tickets.Count)\"\n\n    $htmlBody = @\"\n<style>\nbody { font-family: Arial, sans-serif; }\ntable { border-collapse: collapse; width: 100%; }\nth { background-color: #1a73e8; color: white; padding: 8px; }\ntd { border: 1px solid #ddd; padding: 8px; }\ntr:nth-child(even) { background-color: #f2f2f2; }\n</style>\n$htmlTable\n\"@\n}\n\n# --- Step 5: Send email via Gmail SMTP ---\n$from    = \"your.email@gmail.com\"\n$to      = \"recipient@example.com\"\n$subject = \"Open Jira Tickets Report - KAN\"\n\n$gmailAppPassword = \"xxxx xxxx xxxx xxxx\"  # Your 16-char app password\n$securePwd = ConvertTo-SecureString $gmailAppPassword -AsPlainText -Force\n$cred = New-Object System.Management.Automation.PSCredential ($from, $securePwd)\n\nSend-MailMessage -From $from -To $to -Subject $subject `\n    -Body $htmlBody -BodyAsHtml `\n    -SmtpServer \"smtp.gmail.com\" -Credential $cred -UseSsl -Port 587\n\nWrite-Host \"Email sent! ($($tickets.Count) tickets reported)\" -ForegroundColor Green"
                        }
                    ]
                }
            ]
        },
        {
            title: "Module 12: Putting It All Together",
            sections: [
                {
                    id: "m12s1",
                    title: "12.1 Scheduling with Task Scheduler",
                    showEditor: false,
                    brief: "<ul><li>Windows Task Scheduler runs scripts automatically</li><li>Program: powershell.exe (or pwsh.exe for PS 7)</li><li>Arguments: -File \"D:\\JiraAutomation\\Scripts\\Alert_AllTickets.ps1\"</li><li>Trigger: Daily at 8:00 AM (or your preferred time)</li><li>Run whether user is logged on or not</li><li>Set execution policy: -ExecutionPolicy Bypass</li></ul>",
                    description: "<h4>Scheduling with Task Scheduler</h4><p>The final piece: run your alert script automatically every day without lifting a finger.</p><p><strong>Steps to create a scheduled task:</strong></p><ol><li>Open Task Scheduler (search in Start menu)</li><li>Click <strong>Create Task</strong> (not Basic Task)</li><li><strong>General tab:</strong> Name it \"Jira Daily Report\", check \"Run whether user is logged on or not\"</li><li><strong>Triggers tab:</strong> New \u2192 Daily \u2192 8:00 AM</li><li><strong>Actions tab:</strong> New \u2192 Start a program:<ul><li>Program: <code>powershell.exe</code></li><li>Arguments: <code>-ExecutionPolicy Bypass -File \"D:\\JiraAutomation\\Scripts\\Alert_AllTickets.ps1\"</code></li></ul></li><li><strong>Conditions tab:</strong> Uncheck \"Start only if on AC power\" (for laptops)</li><li>Click OK, enter your Windows password</li></ol><p><strong>Alternative (PowerShell command):</strong></p><pre>$action = New-ScheduledTaskAction -Execute \"powershell.exe\" -Argument '-ExecutionPolicy Bypass -File \"D:\\JiraAutomation\\Scripts\\Alert_AllTickets.ps1\"'\n$trigger = New-ScheduledTaskTrigger -Daily -At 8am\nRegister-ScheduledTask -TaskName \"Jira Daily Report\" -Action $action -Trigger $trigger -RunLevel Highest</pre>",
                    syntax: "",
                    script: "Walk through the Task Scheduler UI step by step. The most common mistakes:\n1. Using 'Create Basic Task' instead of 'Create Task' (basic has fewer options)\n2. Forgetting -ExecutionPolicy Bypass (scripts won't run without it)\n3. Not checking 'Run whether user is logged on or not'\n4. Wrong path to powershell.exe\n\nShow the PowerShell alternative for students who prefer command-line setup.",
                    examples: []
                },
                {
                    id: "m12s2",
                    title: "12.2 Your Complete Automation Suite",
                    showEditor: false,
                    brief: "<ul><li>You built a complete Jira automation system from scratch</li><li>Secure OAuth 2.0 with encrypted token storage</li><li>Query, create, update, and transition tickets</li><li>Professional HTML email reports on schedule</li><li>Modular design \u2014 easy to extend and maintain</li><li>Next steps: add more JQL queries, Slack integration, dashboards</li></ul>",
                    description: "<h4>Your Complete Automation Suite</h4><p><strong>Congratulations!</strong> You have built a production-ready Jira automation system. Here is everything you created:</p><pre>D:\\JiraAutomation\\\n\u251c\u2500\u2500 Config\\\n\u2502   \u2514\u2500\u2500 jira_global_config.json    (connection settings)\n\u251c\u2500\u2500 JiraAuth\\\n\u2502   \u251c\u2500\u2500 JiraAuth.psm1              (encryption + token management)\n\u2502   \u2514\u2500\u2500 Init-JiraAuth.ps1          (one-time OAuth login)\n\u2514\u2500\u2500 Scripts\\\n    \u251c\u2500\u2500 Get-OpenDBATickets.ps1     (query open tickets)\n    \u251c\u2500\u2500 Create-NewTicket.ps1       (create tickets via API)\n    \u251c\u2500\u2500 Change-Assignee.ps1        (reassign tickets)\n    \u251c\u2500\u2500 Change-TicketStatus.ps1    (transition workflow status)\n    \u251c\u2500\u2500 Update-TicketComment.ps1   (add comments)\n    \u2514\u2500\u2500 Alert_AllTickets.ps1       (email HTML report)</pre><p><strong>What you learned:</strong></p><ul><li>PowerShell fundamentals (variables, loops, functions, JSON)</li><li>REST API concepts and Invoke-RestMethod</li><li>OAuth 2.0 authentication with token refresh</li><li>AES encryption for secure credential storage</li><li>Jira Cloud API v3 (search, create, update, transitions)</li><li>HTML report generation and SMTP email</li><li>Task scheduling for hands-free automation</li></ul><p><strong>Next steps to explore:</strong></p><ul><li>Add Slack/Teams notifications instead of email</li><li>Build a PowerShell dashboard with ticket metrics</li><li>Auto-assign tickets based on component or label</li><li>SLA breach detection and escalation</li><li>Bulk operations (close all resolved tickets older than 30 days)</li></ul>",
                    syntax: "",
                    script: "This is the wrap-up. Celebrate what students built. Recap the journey from 'what is a variable' to 'automated Jira email reports on a schedule.' That is a massive achievement.\n\nEncourage students to customize: change the JQL, add more recipients, modify the HTML styling, add new scripts for their specific workflows.\n\nFinal thought: 'You started this course checking Jira manually. Now Jira reports to YOU.'",
                    examples: []
                }
            ]
        }
    ]
};
