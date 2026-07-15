/**
 * PromptLab AI - Frontend Controller Script
 * Core Client Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Initial State & Setup
    // ---------------------------------------------------------
    
    // In-memory array to track history cards (No LocalStorage as requested)
    let historyKits = [
        {
            id: 1,
            projectName: "EduPulse Quiz App",
            projectDesc: "An interactive classroom quiz dashboard with live leaderboard scoring, real-time feedback, and dynamic question generation based on age group.",
            progLang: "TypeScript",
            frontendFramework: "React & Vite",
            backendFramework: "Express.js (Node)",
            database: "MongoDB",
            deployPlatform: "Render",
            aiModel: "Gemini 1.5 Pro",
            difficulty: "Intermediate",
            createdDate: "2026-07-10"
        },
        {
            id: 2,
            projectName: "SecureVault API",
            projectDesc: "A highly secure banking API for user credential encryption, OAuth2 verification, and strict database transaction auditing logs.",
            progLang: "Go",
            frontendFramework: "Vanilla HTML/CSS/JS",
            backendFramework: "Go Fiber / Gin",
            database: "PostgreSQL",
            deployPlatform: "AWS",
            aiModel: "Claude 3.5 Sonnet",
            difficulty: "Advanced",
            createdDate: "2026-07-12"
        },
        {
            id: 3,
            projectName: "QuickTask Manager",
            projectDesc: "A simple drag-and-drop todo planner with categorization tags, sorting filters, and lightweight calendar sync features for startup teams.",
            progLang: "JavaScript",
            frontendFramework: "Vue.js",
            backendFramework: "Serverless Functions",
            database: "SQLite",
            deployPlatform: "Vercel",
            aiModel: "Gemini 1.5 Flash",
            difficulty: "Beginner",
            createdDate: "2026-07-14"
        }
    ];

    // DOM Elements Cache
    const form = document.getElementById('promptGeneratorForm');
    const btnClearForm = document.getElementById('btnClearForm');
    const loadingState = document.getElementById('loadingState');
    const promptKitSection = document.getElementById('promptKitSection');
    const historyCardsGrid = document.getElementById('historyCardsGrid');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // Result Nodes Cache
    const kitProjectTitle = document.getElementById('kitProjectTitle');
    const kitModelText = document.getElementById('kitModelText');
    const kitDiffLabel = document.getElementById('kitDiffLabel');
    const promptTextPlanning = document.getElementById('promptTextPlanning');
    const promptTextDevelopment = document.getElementById('promptTextDevelopment');
    const promptTextImprovement = document.getElementById('promptTextImprovement');
    const promptTextDeployment = document.getElementById('promptTextDeployment');

    const promptCards = [
        document.getElementById('cardPlanning'),
        document.getElementById('cardDevelopment'),
        document.getElementById('cardImprovement'),
        document.getElementById('cardDeployment')
    ];

    // Render Initial History Cards
    renderHistory();

    // Ensure form starts completely empty on page load/refresh (do not persist session data)
    form.reset();

    // ---------------------------------------------------------
    // 2. Prompt Generation Engine (Gemini-Quality Templates)
    // ---------------------------------------------------------

    /**
     * Constructs a realistic, production-quality Planning Prompt.
     */
    function generatePlanningPrompt(data) {
        return `You are an expert Solutions Architect and System Design authority. I am planning a project called "${data.projectName}" with the target specifications listed below. Generate a comprehensive System Design Document and architectural plan.

### TARGET ENVIRONMENT SPECIFICATIONS
- **Project Name:** ${data.projectName}
- **Description:** ${data.projectDesc}
- **Language:** ${data.progLang}
- **Frontend Stack:** ${data.frontendFramework}
- **Backend Stack:** ${data.backendFramework}
- **Database Model:** ${data.database}
- **Difficulty Level:** ${data.difficulty}
- **AI Targeting Engine:** Optimized for ${data.aiModel}

### REQUIRED OUTLINE DETAILS:
1. **Directory Tree & Scaffolding:** Define a clean, production-ready directory structure for this tech stack. Make sure to separate concerns, isolating components, routing controllers, middleware, data access layer, and configurations.
2. **Schema & Database Relations:** Define the primary database schema tables or collections for ${data.database}. Detail all field names, types, indexing choices, and model relations (e.g. primary keys, foreign keys, constraints).
3. **Core REST API Architecture:** Map out the RESTful route definitions needed for key operations (e.g. login, query CRUD, state updates). Specify the exact request schemas and JSON response structures.
4. **Security & Protocol Constraints:** Detail the required middleware configurations (CORS patterns, security headers, JWT session validation schemas) matching a project of ${data.difficulty} difficulty level.`;
    }

    /**
     * Constructs a realistic, production-quality Development Prompt.
     */
    function generateDevelopmentPrompt(data) {
        return `You are a Senior Lead Developer. I need the initial implementation code block blueprints for "${data.projectName}" written in ${data.progLang}. Provide clean, production-ready setup details and code files.

### TECHNICAL SPECIFICATION
- **Framework Integration:** ${data.frontendFramework} (Frontend) with ${data.backendFramework} (Backend)
- **Database Engine:** ${data.database}
- **Coding Rules:** Standard styling, async error bounds, strict types.

### DEVELOPER DIRECTIVES:
1. **System Setup & Dependencies:** Provide the package dependencies list and terminal commands (e.g. npm install, go get, cargo build) to compile the app.
2. **Database Connector Middleware:** Provide a robust, clean database initialization script connecting to ${data.database}. Implement pooling limits, failure handlers, and connection logging.
3. **Backend Service Controller:** Write a complete backend handler/controller script using ${data.backendFramework}. Implement validation schemas for incoming requests, correct error response codes, and query operations.
4. **Frontend View Component:** Write a clean ${data.frontendFramework} UI component displaying how state is fetched, rendered, and updated. Ensure it integrates correct API hooks and error indicators.`;
    }

    /**
     * Constructs a realistic, production-quality Improvement Prompt.
     */
    function generateImprovementPrompt(data) {
        return `You are a Principal Software Quality and Security Engineer. Review, optimize, and write robust test coverage for the project "${data.projectName}" built using ${data.progLang}.

### INFRASTRUCTURE CONTEXT
- **Component Stack:** ${data.frontendFramework} + ${data.backendFramework}
- **Storage Profile:** ${data.database}
- **Target Complexity:** ${data.difficulty}

### REFOCUSED TASKS:
1. **Security Vulnerability Checklist:** What are the most common vulnerabilities (e.g. SQL Injection, XSS, payload limits) in a ${data.backendFramework} and ${data.database} setup, and how do we patch them?
2. **Database Performance Audit:** Provide query optimizations for ${data.database} specifically for this use case. Outline index additions and explain query scaling patterns.
3. **Unit & Integration Suite:** Write complete unit tests using popular frameworks (like Jest, PyTest, or Go Testing) to test the core backend router logic. Cover normal flows and database crash edge cases.
4. **Clean Code & Performance Boundaries:** Provide suggestions for caching (e.g. Redis), API throttling, or code splitting to ensure a high-performing user experience.`;
    }

    /**
     * Constructs a realistic, production-quality Deployment Prompt.
     */
    function generateDeploymentPrompt(data) {
        return `You are a DevOps and SRE Architect. Write a deployment configuration, containerization strategy, and CI/CD automated setup to host the project "${data.projectName}" on ${data.deployPlatform}.

### SYSTEM CONFIGURATION
- **Hosting Service:** ${data.deployPlatform}
- **Stack Platform:** ${data.progLang} (${data.frontendFramework} and ${data.backendFramework})
- **Database Dependencies:** ${data.database}

### INFRASTRUCTURE REQUISITES:
1. **Multi-stage Docker Containerization:** Write a optimized, secure multi-stage \`Dockerfile\` suitable for ${data.progLang}. Ensure minimal final image size by utilizing light distroless or alpine base layers.
2. **CI/CD Pipeline Blueprint:** Write a complete automated pipeline configuration (e.g. GitHub Actions YAML, GitLab CI) that checks out the repo, runs test suites, builds production bundles, and pushes updates to ${data.deployPlatform}.
3. **Platform Setup Steps:** List the direct commands or dashboard steps to link environment variables, mount database configurations, and provision secure SSL routes.
4. **Site Reliability Metrics:** Detail a service health-check script and specify key alert thresholds for RAM, CPU, and network response latency.`;
    }

    // ---------------------------------------------------------
    // 3. Form Validation & Submission Logic
    // ---------------------------------------------------------

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Get form values and map them exactly to expected backend keys
            const formData = {
                projectName: document.getElementById('projectName').value.trim(),
                description: document.getElementById('projectDesc').value.trim(),
                language: document.getElementById('progLang').value,
                frontend: document.getElementById('frontendFramework').value,
                backend: document.getElementById('backendFramework').value,
                database: document.getElementById('database').value,
                deployment: document.getElementById('deployPlatform').value,
                targetAssistant: document.getElementById('aiModel').value
            };
            const difficulty = document.getElementById('difficulty').value;

            // Trigger Generator Flow with mapped data and difficulty metadata
            generatePromptKit(formData, difficulty);
        }
    });

    // Clear Form Action
    if (btnClearForm) {
        btnClearForm.addEventListener('click', () => {
            clearForm();
        });
    }

    /**
     * Clears all form inputs and removes validation error indicator classes.
     */
    function clearForm() {
        form.reset();
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('invalid');
        });
    }

    /**
     * Validates all form inputs, returns true if completely valid.
     */
    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            if (input.required && (!input.value || input.value.trim() === '')) {
                formGroup.classList.add('invalid');
                isValid = false;
            } else {
                formGroup.classList.remove('invalid');
            }
        });
        
        // Dynamic event listener to clear validation state on change
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const formGroup = input.closest('.form-group');
                if (input.value && input.value.trim() !== '') {
                    formGroup.classList.remove('invalid');
                }
            });
            input.addEventListener('change', () => {
                const formGroup = input.closest('.form-group');
                if (input.value) {
                    formGroup.classList.remove('invalid');
                }
            });
        });

        // Focus first invalid item
        if (!isValid) {
            const firstInvalid = form.querySelector('.form-group.invalid input, .form-group.invalid select, .form-group.invalid textarea');
            if (firstInvalid) firstInvalid.focus();
        }

        return isValid;
    }

    /**
     * Connects to Express backend API to generate real prompt kits.
     */
    function generatePromptKit(formData, difficulty) {
        // Reset and Hide previous results
        promptKitSection.classList.add('hidden');
        resetStaggerAnimations();

        // Show spinner
        loadingState.classList.remove('hidden');
        loadingState.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Set up dynamic loading text messages
        const loadingText = loadingState.querySelector('.loading-text');
        const progressMessages = [
            "Analyzing project...",
            "Designing architecture...",
            "Generating prompts...",
            "Finalizing Prompt Kit..."
        ];
        let currentMessageIndex = 0;
        loadingText.textContent = progressMessages[currentMessageIndex];

        const progressInterval = setInterval(() => {
            currentMessageIndex = (currentMessageIndex + 1) % progressMessages.length;
            loadingText.textContent = progressMessages[currentMessageIndex];
        }, 1500);

        // POST request to backend API
        fetch('http://localhost:5000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('API_FAIL');
            }
            return response.json();
        })
        .then(promptKit => {
            // Validate response fields
            if (!promptKit || 
                !promptKit.planning || typeof promptKit.planning.prompt !== 'string' ||
                !promptKit.development || typeof promptKit.development.prompt !== 'string' ||
                !promptKit.improvement || typeof promptKit.improvement.prompt !== 'string' ||
                !promptKit.deployment || typeof promptKit.deployment.prompt !== 'string') {
                throw new Error('INVALID_RESPONSE');
            }

            // Hide spinner and clear timer
            loadingState.classList.add('hidden');
            clearInterval(progressInterval);

            // Set result contents
            kitProjectTitle.textContent = formData.projectName;
            kitModelText.textContent = formData.targetAssistant;
            kitDiffLabel.textContent = difficulty;
            
            // Apply theme variations depending on Difficulty
            updateDifficultyBadgeStyle(difficulty);

            // Write generated prompt texts from backend response
            promptTextPlanning.textContent = promptKit.planning.prompt;
            promptTextDevelopment.textContent = promptKit.development.prompt;
            promptTextImprovement.textContent = promptKit.improvement.prompt;
            promptTextDeployment.textContent = promptKit.deployment.prompt;

            // Display Results wrapper
            promptKitSection.classList.remove('hidden');

            // Scroll smoothly into view
            promptKitSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Reveal cards sequentially using staggering fade-ins (400ms interval)
            revealCardsSequentially();

            // Push into in-memory history tracker (retaining properties for rendering)
            const newHistoryItem = {
                id: Date.now(), // Unique ID
                projectName: formData.projectName,
                projectDesc: formData.description,
                progLang: formData.language,
                frontendFramework: formData.frontend,
                backendFramework: formData.backend,
                database: formData.database,
                deployPlatform: formData.deployment,
                aiModel: formData.targetAssistant,
                difficulty: difficulty,
                createdDate: new Date().toISOString().split('T')[0],
                promptKit: promptKit // Store actual prompt kit for viewing later
            };
            historyKits.unshift(newHistoryItem); // Add to beginning
            renderHistory();

        })
        .catch(err => {
            console.error("[API Error]:", err);
            // Hide spinner and clear timer
            loadingState.classList.add('hidden');
            clearInterval(progressInterval);

            // Determine user-friendly error message
            let errorMessage = "Unable to connect to the backend. Please start the backend server and try again.";
            if (err.message === 'API_FAIL') {
                errorMessage = "Something went wrong while generating your Prompt Kit. Please try again.";
            } else if (err.message === 'INVALID_RESPONSE') {
                errorMessage = "Received an unexpected response from the server. Please try again.";
            }

            // Show toast message with error design
            showToast(errorMessage, true);
        });
    }

    /**
     * Updates colors on the Difficulty display tag.
     */
    function updateDifficultyBadgeStyle(diff) {
        kitDiffLabel.className = 'badge-diff'; // clear classes
        if (diff === 'Beginner') {
            kitDiffLabel.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            kitDiffLabel.style.background = 'rgba(16, 185, 129, 0.15)';
            kitDiffLabel.style.color = '#34D399';
        } else if (diff === 'Intermediate') {
            kitDiffLabel.style.borderColor = 'rgba(6, 182, 212, 0.2)';
            kitDiffLabel.style.background = 'rgba(6, 182, 212, 0.15)';
            kitDiffLabel.style.color = '#22D3EE';
        } else if (diff === 'Advanced') {
            kitDiffLabel.style.borderColor = 'rgba(245, 158, 11, 0.2)';
            kitDiffLabel.style.background = 'rgba(245, 158, 11, 0.15)';
            kitDiffLabel.style.color = '#FBBF24';
        }
    }

    /**
     * Resets layout classes on the result cards.
     */
    function resetStaggerAnimations() {
        promptCards.forEach(card => {
            card.style.opacity = '0';
            card.classList.remove('stagger-reveal');
            
            // Auto expand planning prompt on reveal, collapse others
            const body = card.querySelector('.prompt-card-body');
            const parent = card;
            if (parent.id === 'cardPlanning') {
                body.classList.add('expanded');
                body.style.maxHeight = '1200px';
                parent.classList.add('open');
            } else {
                body.classList.remove('expanded');
                body.style.maxHeight = '0px';
                parent.classList.remove('open');
            }
        });
    }

    /**
     * Animates prompt cards sequentially Planning -> Development -> Improvement -> Deployment
     */
    function revealCardsSequentially() {
        promptCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('stagger-reveal');
            }, index * 400); // 400ms delay increments
        });
    }

    // ---------------------------------------------------------
    // 4. Accordion Toggle Interactions
    // ---------------------------------------------------------

    promptCards.forEach(card => {
        const header = card.querySelector('.prompt-card-header');
        const body = card.querySelector('.prompt-card-body');
        
        // Prevent toggle if copy button was clicked
        header.addEventListener('click', (e) => {
            if (e.target.closest('.btn-copy')) return;
            
            const isExpanded = body.classList.contains('expanded');
            
            if (isExpanded) {
                body.style.maxHeight = body.scrollHeight + 'px'; // Set current actual height first
                setTimeout(() => {
                    body.style.maxHeight = '0';
                    body.classList.remove('expanded');
                    card.classList.remove('open');
                }, 10);
            } else {
                body.classList.add('expanded');
                body.style.maxHeight = body.scrollHeight + 'px';
                card.classList.add('open');
                
                // Allow transition to finish, then set to auto or high number for dynamic code sizing
                setTimeout(() => {
                    if (body.classList.contains('expanded')) {
                        body.style.maxHeight = '1200px';
                    }
                }, 400);
            }
        });
    });

    // ---------------------------------------------------------
    // 5. Clipboard Copy API Integration
    // ---------------------------------------------------------

    document.querySelectorAll('.btn-copy').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = button.getAttribute('data-target');
            const codeElement = document.getElementById(targetId);
            
            if (codeElement) {
                const textToCopy = codeElement.textContent;
                
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        // Success Feedback
                        showToast("Prompt copied to clipboard!");
                        button.innerHTML = '<i class="fa-solid fa-check text-emerald"></i>';
                        button.classList.add('copied');
                        
                        setTimeout(() => {
                            button.innerHTML = '<i class="fa-regular fa-copy"></i>';
                            button.classList.remove('copied');
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                        showToast("Failed to copy. Please select text manually.", true);
                    });
            }
        });
    });

    // ---------------------------------------------------------
    // 5b. Entire Kit Actions: Copy and Download
    // ---------------------------------------------------------

    function getEntireKitMarkdown() {
        const projectName = kitProjectTitle.textContent;
        const planning = promptTextPlanning.textContent;
        const development = promptTextDevelopment.textContent;
        const improvement = promptTextImprovement.textContent;
        const deployment = promptTextDeployment.textContent;
        
        return `# ${projectName} Prompt Kit

## Planning Prompt
${planning}

## Development Prompt
${development}

## Improvement Prompt
${improvement}

## Deployment Prompt
${deployment}`;
    }

    const btnCopyEntireKit = document.getElementById('btnCopyEntireKit');
    const btnDownloadKit = document.getElementById('btnDownloadKit');

    if (btnCopyEntireKit) {
        btnCopyEntireKit.addEventListener('click', () => {
            const markdownContent = getEntireKitMarkdown();
            navigator.clipboard.writeText(markdownContent)
                .then(() => {
                    showToast("Prompt Kit copied to clipboard!");
                    const originalHTML = btnCopyEntireKit.innerHTML;
                    btnCopyEntireKit.innerHTML = '<i class="fa-solid fa-check text-emerald"></i> <span>Copied!</span>';
                    btnCopyEntireKit.classList.add('copied');
                    
                    setTimeout(() => {
                        btnCopyEntireKit.innerHTML = originalHTML;
                        btnCopyEntireKit.classList.remove('copied');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Could not copy entire kit: ', err);
                    showToast("Failed to copy Prompt Kit.", true);
                });
        });
    }

    if (btnDownloadKit) {
        btnDownloadKit.addEventListener('click', () => {
            const markdownContent = getEntireKitMarkdown();
            const projectName = kitProjectTitle.textContent.trim();
            // Sanitize filename: replace invalid characters
            let filename = projectName.replace(/[/\\?%*:|"<>]/g, '-').trim();
            if (!filename) filename = 'PromptKit';
            
            const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}.md`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    /**
     * Shows a customized glassmorphic toast notification.
     */
    function showToast(message, isError = false) {
        toastMessage.textContent = message;
        
        const icon = toast.querySelector('i');
        if (isError) {
            icon.className = 'fa-solid fa-circle-xmark text-red';
            toast.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        } else {
            icon.className = 'fa-solid fa-circle-check text-emerald';
            toast.style.borderColor = 'var(--card-border-active)';
        }

        toast.classList.remove('hidden');
        
        // Hide after 2.5 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2500);
    }

    // ---------------------------------------------------------
    // 6. History Module (View / Delete In-Memory Cards)
    // ---------------------------------------------------------

    /**
     * Renders history grid cards from historyKits array.
     */
    function renderHistory() {
        historyCardsGrid.innerHTML = '';
        
        if (historyKits.length === 0) {
            historyCardsGrid.innerHTML = `
                <div class="glass-card full-width" style="grid-column: span 3; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
                    <p>No history available. Generate a prompt kit above to create one.</p>
                </div>
            `;
            return;
        }

        historyKits.forEach(kit => {
            const card = document.createElement('div');
            card.className = 'glass-card history-card animate-fade-in';
            card.setAttribute('data-id', kit.id);

            // Collect unique technology stack chips
            const stack = [kit.progLang, kit.frontendFramework, kit.backendFramework, kit.database].filter(x => x && x !== 'None');

            card.innerHTML = `
                <div class="history-card-header">
                    <div class="title-details">
                        <span class="history-card-date">${kit.createdDate}</span>
                        <h4 class="history-card-title">${kit.projectName}</h4>
                    </div>
                </div>
                <div class="history-card-stack">
                    ${stack.map(tech => `<span class="stack-tag">${tech}</span>`).join('')}
                </div>
                <div class="history-card-meta">
                    <i class="fa-solid fa-microchip"></i>
                    <span>${kit.aiModel} • ${kit.difficulty}</span>
                </div>
                <div class="history-card-actions">
                    <button class="btn btn-view-history" data-id="${kit.id}">
                        <i class="fa-regular fa-eye"></i> View
                    </button>
                    <button class="btn btn-delete-history" data-id="${kit.id}">
                        <i class="fa-regular fa-trash-can"></i> Delete
                    </button>
                </div>
            `;
            
            historyCardsGrid.appendChild(card);
        });

        // Attach listeners to newly created buttons
        attachHistoryButtonListeners();
    }

    /**
     * Attaches view/delete handlers to current cards.
     */
    function attachHistoryButtonListeners() {
        // View Button Action
        document.querySelectorAll('.btn-view-history').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const foundKit = historyKits.find(kit => kit.id === id);
                
                if (foundKit) {
                    // Populate Form with history details to view/edit
                    document.getElementById('projectName').value = foundKit.projectName;
                    document.getElementById('projectDesc').value = foundKit.projectDesc;
                    document.getElementById('progLang').value = foundKit.progLang;
                    document.getElementById('frontendFramework').value = foundKit.frontendFramework;
                    document.getElementById('backendFramework').value = foundKit.backendFramework;
                    document.getElementById('database').value = foundKit.database;
                    document.getElementById('deployPlatform').value = foundKit.deployPlatform;
                    document.getElementById('aiModel').value = foundKit.aiModel;
                    document.getElementById('difficulty').value = foundKit.difficulty;

                    // Immediately show the prompt kit matching history details (snappy responsive view)
                    kitProjectTitle.textContent = foundKit.projectName;
                    kitModelText.textContent = foundKit.aiModel;
                    kitDiffLabel.textContent = foundKit.difficulty;
                    updateDifficultyBadgeStyle(foundKit.difficulty);

                    if (foundKit.promptKit) {
                        promptTextPlanning.textContent = foundKit.promptKit.planning.prompt;
                        promptTextDevelopment.textContent = foundKit.promptKit.development.prompt;
                        promptTextImprovement.textContent = foundKit.promptKit.improvement.prompt;
                        promptTextDeployment.textContent = foundKit.promptKit.deployment.prompt;
                    } else {
                        // Fallback to local template generator for initial/legacy history items
                        promptTextPlanning.textContent = generatePlanningPrompt(foundKit);
                        promptTextDevelopment.textContent = generateDevelopmentPrompt(foundKit);
                        promptTextImprovement.textContent = generateImprovementPrompt(foundKit);
                        promptTextDeployment.textContent = generateDeploymentPrompt(foundKit);
                    }

                    // Display results wrapper and animate
                    promptKitSection.classList.remove('hidden');
                    resetStaggerAnimations();
                    
                    // Reveal instantly or slightly offset for smooth experience
                    revealCardsSequentially();
                    
                    promptKitSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    showToast("Loaded Prompt Kit details!");
                }
            });
        });

        // Delete Button Action
        document.querySelectorAll('.btn-delete-history').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const card = btn.closest('.history-card');
                
                // Triggers exit transition
                card.classList.add('history-card-exit');
                
                // Wait for the exit animation duration (300ms)
                setTimeout(() => {
                    historyKits = historyKits.filter(kit => kit.id !== id);
                    renderHistory();
                    showToast("Kit deleted from history.", true);
                }, 300);
            });
        });
    }
});
