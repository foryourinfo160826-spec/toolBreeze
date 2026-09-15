document.addEventListener('DOMContentLoaded', function () {

    // 1. CLEAN URL ROUTES & METADATA
    const routes = {
        '/': { panel: 'home-panel', title: 'devZtoolkit - Free Developer Tools', desc: 'Collection of free, fast developer tools including code formatters, diff viewers, and API testers.' },
        '/formatter': { panel: 'formatter-panel', title: 'Online Code Formatter & Splitter - devZtoolkit', desc: 'Format JSON, HTML, SQL, and Python code instantly.' },
        '/diff': { panel: 'diff-panel', title: 'GitHub-Style Code Diff Checker - devZtoolkit', desc: 'Compare text and code changes line by line.' },
        '/git': { panel: 'git-panel', title: 'Git Command Generator - devZtoolkit', desc: 'Generate complex git commands easily.' },
        '/jwt': { panel: 'jwt-panel', title: 'JWT Decoder - devZtoolkit', desc: 'Decode and inspect JSON Web Tokens securely in your browser.' },
        '/base64': { panel: 'base64-panel', title: 'Base64 Encoder/Decoder - devZtoolkit', desc: 'Encode and decode Base64 strings quickly.' },
        '/regex': { panel: 'regex-panel', title: 'Regex Tester - devZtoolkit', desc: 'Test and debug regular expressions in real time.' },
        '/cron': { panel: 'cron-panel', title: 'Cron Expression Generator - devZtoolkit', desc: 'Build and interpret cron job schedules easily.' },
        '/api-tester': { panel: 'api-panel', title: 'Online REST API Tester - devZtoolkit', desc: 'Test REST APIs securely with encrypted link sharing and export features.' }, 
        '/hash': { panel: 'hash-panel', title: 'SHA-256 Hash Generator - devZtoolkit', desc: 'Compute secure cryptographic SHA-256 hashes.' },
        '/uuid': { panel: 'uuid-panel', title: 'UUID v4 Generator - devZtoolkit', desc: 'Generate standard random UUID version 4 identifiers.' }
    };

    const routePathMap = {
        'home-panel': '/',
        'formatter-panel': '/formatter',
        'diff-panel': '/diff',
        'git-panel': '/git',
        'jwt-panel': '/jwt',
        'base64-panel': '/base64',
        'regex-panel': '/regex',
        'cron-panel': '/cron',
        'api-panel': '/api-tester',
        'hash-panel': '/hash',
        'uuid-panel': '/uuid'
    };

    function handleRoute(path) {
        // Clean pathname if running via Live Server (e.g., /index.html/api-tester -> /api-tester)
        let cleanPath = path.replace('/index.html', '') || '/';
        if (cleanPath === '') cleanPath = '/';

        const currentRoute = routes[cleanPath] || routes['/'];

        // Hide all panels
        Object.values(routes).forEach(r => {
            const el = document.getElementById(r.panel);
            if (el) el.style.display = 'none';
        });

        // Show target panel
        const targetEl = document.getElementById(currentRoute.panel);
        if (targetEl) targetEl.style.display = 'block';

        // Update active class on sidebar buttons
        const targetPanelId = currentRoute.panel;
        document.querySelectorAll('.sidebar-btn').forEach(b => {
            if (b.getAttribute('data-target') === targetPanelId) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        // Update dynamic SEO metadata & title
        document.title = currentRoute.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', currentRoute.desc);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Global clean URL navigation function
    window.navigateTo = function (path) {
        window.history.pushState({}, '', path);
        handleRoute(path);
    };

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        handleRoute(window.location.pathname);
    });

    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    const sidebar = document.getElementById('sidebar');

    // Safe Event Listener Helper
    function on(id, event, callback) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener(event, callback);
        }
    }

    // Modern Toast Helper
    function showToast(message, type = 'success') {
        const toastMsg = document.getElementById('toastMessage');
        const toastEl = document.getElementById('appToast');
        if (!toastMsg || !toastEl) return;

        toastMsg.textContent = message;
        toastEl.className = `toast align-items-center text-bg-dark border shadow-lg rounded-3 ${type === 'error' ? 'border-danger' : 'border-success'}`;

        const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
        toast.show();
    }

    // Custom Modal Prompt Helper (Returns a Promise)
    function showPasswordPrompt(title, description) {
        return new Promise((resolve) => {
            const modalEl = document.getElementById('passwordModal');
            const titleEl = document.getElementById('passwordModalTitle');
            const descEl = document.getElementById('passwordModalDesc');
            const inputEl = document.getElementById('customPasswordInput');
            const submitBtn = document.getElementById('modalSubmitBtn');
            const cancelBtn = document.getElementById('modalCancelBtn');

            if (!modalEl) { resolve(null); return; }

            titleEl.textContent = title;
            descEl.textContent = description;
            inputEl.value = '';

            const modal = new bootstrap.Modal(modalEl);
            modal.show();

            modalEl.addEventListener('shown.bs.modal', () => inputEl.focus(), { once: true });

            const cleanup = () => {
                submitBtn.removeEventListener('click', onSubmit);
                cancelBtn.removeEventListener('click', onCancel);
                inputEl.removeEventListener('keydown', onKeydown);
            };

            const onSubmit = () => {
                const val = inputEl.value;
                modal.hide();
                cleanup();
                resolve(val);
            };

            const onCancel = () => {
                modal.hide();
                cleanup();
                resolve(null);
            };

            const onKeydown = (e) => {
                if (e.key === 'Enter') onSubmit();
            };

            submitBtn.addEventListener('click', onSubmit);
            cancelBtn.addEventListener('click', onCancel);
            inputEl.addEventListener('keydown', onKeydown);
        });
    }

    // Explicit Logo Click Handlers
    const logoBrand = document.getElementById('sidebarLogoLink');
    const headerLogo = document.getElementById('headerLogoLink');

    [logoBrand, headerLogo].forEach(el => {
        if (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                navigateTo('/');
                if (sidebar && window.innerWidth < 992) sidebar.classList.remove('show');
            });
        }
    });

    // Sidebar Button Clicks
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const path = routePathMap[targetId] || '/';
            navigateTo(path);
            if (sidebar && window.innerWidth < 992) sidebar.classList.remove('show');
        });
    });

    // Initial Path Route Check on Load
    handleRoute(window.location.pathname);

    on('toggleSidebar', 'click', () => sidebar?.classList.add('show'));
    on('closeSidebar', 'click', () => sidebar?.classList.remove('show'));

    // 2. INTERACTIVE LOCAL STORAGE HISTORY
    function saveHistory(toolName, content, rawInput = '') {
        let history = JSON.parse(localStorage.getItem('dev_history') || '[]');
        history.unshift({
            tool: toolName,
            text: content,
            rawInput: rawInput,
            preview: content.slice(0, 45) + (content.length > 45 ? '...' : ''),
            date: new Date().toLocaleTimeString()
        });
        if (history.length > 15) history.pop();
        localStorage.setItem('dev_history', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        const list = document.getElementById('historyList');
        if (!list) return;

        let history = JSON.parse(localStorage.getItem('dev_history') || '[]');
        list.innerHTML = history.length === 0 ? '<li class="list-group-item bg-transparent text-secondary">No history recorded yet.</li>' : '';

        const toolToPanelMap = {
            'Git Helper': 'git-panel',
            'Code Diff': 'diff-panel',
            'Code Formatter': 'formatter-panel',
            'Base64 Encode': 'base64-panel',
            'Base64 Decode': 'base64-panel',
            'Hash Generator': 'hash-panel',
            'JWT Decoder': 'jwt-panel',
            'Regex Tester': 'regex-panel',
            'Cron Explainer': 'cron-panel',
            'UUID Generator': 'uuid-panel',
            'API Test': 'api-panel'
        };

        history.forEach((item) => {
            const baseToolKey = Object.keys(toolToPanelMap).find(t => item.tool.startsWith(t)) || '';
            const targetPanel = toolToPanelMap[baseToolKey] || '';

            const li = document.createElement('li');
            li.className = 'list-group-item bg-transparent text-light border-secondary border-opacity-25 history-item-interactive rounded mb-1';

            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-success fw-semibold">${item.tool}</small>
                    <span class="text-secondary" style="font-size: 0.75rem;">${item.date}</span>
                </div>
                <div class="text-truncate text-secondary small mt-1">${item.preview || item.text}</div>
            `;

            if (targetPanel) {
                li.addEventListener('click', () => {
                    const path = routePathMap[targetPanel] || '/';
                    navigateTo(path);

                    if (targetPanel === 'formatter-panel') {
                        if (item.rawInput) {
                            const fmtIn = document.getElementById('codeFormatterInput');
                            if (fmtIn) fmtIn.value = item.rawInput;
                        }
                        const fmtOut = document.getElementById('codeFormatterOutput');
                        if (fmtOut) fmtOut.value = item.text;
                    } else if (targetPanel === 'git-panel') {
                        const gitRes = document.getElementById('gitResult');
                        if (gitRes) gitRes.value = item.text;
                    } else if (targetPanel === 'base64-panel') {
                        if (item.rawInput) {
                            const bIn = document.getElementById('base64Input');
                            if (bIn) bIn.value = item.rawInput;
                        }
                        const bOut = document.getElementById('base64Output');
                        if (bOut) bOut.value = item.text;
                    } else if (targetPanel === 'jwt-panel') {
                        if (item.rawInput) {
                            const jIn = document.getElementById('jwtInput');
                            if (jIn) {
                                jIn.value = item.rawInput;
                                jIn.dispatchEvent(new Event('input'));
                            }
                        }
                    } else if (targetPanel === 'uuid-panel') {
                        const uOut = document.getElementById('uuidOutput');
                        if (uOut) uOut.value = item.text;
                    } else if (targetPanel === 'api-panel') {
                        if (item.rawInput) {
                            try {
                                const state = JSON.parse(item.rawInput);
                                const mEl = document.getElementById('apiMethod');
                                const uEl = document.getElementById('apiUrl');
                                const hEl = document.getElementById('apiHeaders');
                                const bEl = document.getElementById('apiRequestBody');
                                const outEl = document.getElementById('ApiResponseOutput');
                                const statusEl = document.getElementById('apiStatus');

                                if (mEl) mEl.value = state.method || 'GET';
                                if (uEl) uEl.value = state.url || '';
                                if (hEl) hEl.value = state.headers || '';
                                if (bEl) bEl.value = state.body || '';
                                if (outEl) outEl.value = state.response || '';
                                if (statusEl) {
                                    statusEl.textContent = `Status: ${state.status || 'Restored'}`;
                                    statusEl.className = "text-success";
                                }
                            } catch (err) {
                                console.error("Failed to parse API history payload", err);
                            }
                        }
                    }

                    const drawerEl = document.getElementById('historyDrawer');
                    if (drawerEl && window.bootstrap) {
                        const instance = bootstrap.Offcanvas.getInstance(drawerEl);
                        if (instance) instance.hide();
                    }
                });
            }

            list.appendChild(li);
        });
    }

    on('btnClearHistory', 'click', () => {
        localStorage.removeItem('dev_history');
        renderHistory();
    });

    renderHistory();

    // 3. GIT HELPER LOGIC
    const branchInput = document.getElementById('branchName');
    const targetInput = document.getElementById('targetBranch');
    const opSelect = document.getElementById('gitOp');
    const resultInput = document.getElementById('gitResult');

    function generateGitCmd() {
        if (!branchInput || !targetInput || !opSelect || !resultInput) return;
        const branch = branchInput.value.trim() || 'feature-branch';
        const target = targetInput.value.trim() || 'main';
        let cmd = '';
        switch (opSelect.value) {
            case 'create_push': cmd = `git checkout -b ${branch} && git push -u origin ${branch}`; break;
            case 'merge': cmd = `git checkout ${target} && git pull origin ${target} && git merge ${branch}`; break;
            case 'delete_both': cmd = `git branch -d ${branch} && git push origin --delete ${branch}`; break;
            case 'hard_reset': cmd = `git fetch origin && git reset --hard origin/${target}`; break;
            case 'squash': cmd = `git rebase -i HEAD~3`; break;
            case 'rename': cmd = `git branch -m ${branch}`; break;
        }
        resultInput.value = cmd;
    }
    branchInput?.addEventListener('input', generateGitCmd);
    targetInput?.addEventListener('input', generateGitCmd);
    opSelect?.addEventListener('change', generateGitCmd);
    on('btnCopyGit', 'click', () => {
        if (resultInput && resultInput.value) {
            navigator.clipboard.writeText(resultInput.value);
            saveHistory('Git Helper', resultInput.value);
            showToast('📋 Git command copied to clipboard!');
        }
    });
    generateGitCmd();

    // 4. GITHUB-STYLE DIFF ENGINE WITH 3-LINE CONTEXT COLLAPSING
    on('btnCompareDiff', 'click', function () {
        const origEl = document.getElementById('diffOriginal');
        const modEl = document.getElementById('diffModified');
        if (!origEl || !modEl) return;

        const orig = origEl.value.split('\n');
        const mod = modEl.value.split('\n');
        const tableBody = document.getElementById('diffOutputTable');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        document.getElementById('diffOutputContainer')?.classList.remove('d-none');

        const maxLines = Math.max(orig.length, mod.length);
        let rawLines = [];

        for (let i = 0; i < maxLines; i++) {
            const origVal = orig[i];
            const modVal = mod[i];

            if (origVal === modVal) {
                if (origVal !== undefined) rawLines.push({ type: 'same', text: origVal, origNum: i + 1, modNum: i + 1 });
            } else {
                if (origVal !== undefined) rawLines.push({ type: 'del', text: origVal, origNum: i + 1, modNum: '' });
                if (modVal !== undefined) rawLines.push({ type: 'add', text: modVal, origNum: '', modNum: i + 1 });
            }
        }

        let blockId = 0;
        let i = 0;

        while (i < rawLines.length) {
            if (rawLines[i].type !== 'same') {
                renderRow(tableBody, rawLines[i]);
                i++;
            } else {
                let startSame = i;
                while (i < rawLines.length && rawLines[i].type === 'same') {
                    i++;
                }
                let sameCount = i - startSame;

                if (sameCount > 6) {
                    for (let k = startSame; k < startSame + 3; k++) renderRow(tableBody, rawLines[k]);

                    const hiddenCount = sameCount - 6;
                    blockId++;
                    const currentBlockId = `diff-fold-${blockId}`;

                    const foldHeaderTr = document.createElement('tr');
                    foldHeaderTr.innerHTML = `
                        <td colspan="3" class="p-0">
                            <div class="diff-unfold-bar" onclick="document.querySelectorAll('.${currentBlockId}').forEach(r => r.classList.toggle('d-none'))">
                                <i class="bi bi-unfold me-1"></i> Expand ${hiddenCount} hidden unchanged lines...
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(foldHeaderTr);

                    for (let k = startSame + 3; k < i - 3; k++) {
                        renderRow(tableBody, rawLines[k], `${currentBlockId} d-none`);
                    }

                    for (let k = i - 3; k < i; k++) renderRow(tableBody, rawLines[k]);
                } else {
                    for (let k = startSame; k < i; k++) renderRow(tableBody, rawLines[k]);
                }
            }
        }

        saveHistory('Code Diff', `Diff comparison completed (${maxLines} lines processed)`);
    });

    function renderRow(container, lineObj, extraClass = '') {
        const tr = document.createElement('tr');
        if (extraClass) tr.className = extraClass;

        let symbol = ' ';
        let cssClass = 'diff-line-same';
        if (lineObj.type === 'add') { symbol = '+'; cssClass = 'diff-line-add'; }
        if (lineObj.type === 'del') { symbol = '-'; cssClass = 'diff-line-del'; }

        tr.innerHTML = `
            <td class="diff-line-num">${lineObj.origNum || ''}</td>
            <td class="diff-line-num">${lineObj.modNum || ''}</td>
            <td class="${cssClass}">${symbol} ${escapeHtml(lineObj.text)}</td>
        `;
        container.appendChild(tr);
    }

    function escapeHtml(str) {
        return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // 5. FORMATTER & PYTHON SPLITTER LOGIC
    const codeInput = document.getElementById('codeFormatterInput');
    const codeOutput = document.getElementById('codeFormatterOutput');
    const codeLang = document.getElementById('codeLangSelect');

    function formatHTML(code) {
        let formatted = '', indent = 0;
        const tokens = code.replace(/</g, '~%~<').replace(/>/g, '>~%~').split('~%~');
        tokens.forEach(token => {
            const trimmed = token.trim();
            if (!trimmed) return;
            if (trimmed.startsWith('</')) indent = Math.max(0, indent - 1);
            formatted += '  '.repeat(indent) + trimmed + '\n';
            if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.startsWith('<!')) {
                indent++;
            }
        });
        return formatted.trim();
    }

    function formatBracedCode(code) {
        let formatted = '', indent = 0;
        const lines = code.replace(/\{/g, '{\n').replace(/\}/g, '\n}\n').replace(/;/g, ';\n').split('\n');
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;
            if (trimmed.startsWith('}')) indent = Math.max(0, indent - 1);
            formatted += '    '.repeat(indent) + trimmed + '\n';
            if (trimmed.endsWith('{')) indent++;
        });
        return formatted.trim();
    }

    function formatPython(code) {
        if (!code) return '';
        let normalized = code.replace(/;+/g, '\n');
        const pythonKeywords = [
            'import', 'from', 'def', 'class', 'if', 'elif', 'else', 'try',
            'except', 'finally', 'for', 'while', 'print', 'return', 'raise',
            'with', 'assert', 'pass', 'break', 'continue'
        ];

        const pattern = new RegExp(`([\\)\\'\\"])\\s*(${pythonKeywords.join('|')})\\b`, 'g');
        normalized = normalized.replace(pattern, '$1\n$2');

        let lines = normalized.split('\n');
        let formattedLines = [];
        let currentIndent = 0;

        lines.forEach(rawLine => {
            let trimmed = rawLine.trim();
            if (!trimmed) {
                formattedLines.push('');
                return;
            }

            if (trimmed.startsWith('#')) {
                formattedLines.push('    '.repeat(currentIndent) + trimmed);
                return;
            }

            if (/^(else|elif\b|except\b|finally):/.test(trimmed)) {
                let dedented = Math.max(0, currentIndent - 1);
                formattedLines.push('    '.repeat(dedented) + trimmed);
            } else {
                formattedLines.push('    '.repeat(currentIndent) + trimmed);
            }

            if (trimmed.endsWith(':') && !trimmed.startsWith('#')) {
                currentIndent++;
            }

            if (/^(return|pass|break|raise)\b/.test(trimmed) && currentIndent > 0) {
                currentIndent = Math.max(0, currentIndent - 1);
            }
        });

        return formattedLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    }

    on('btnFormatCode', 'click', () => {
        if (!codeInput || !codeOutput || !codeLang) return;
        const val = codeInput.value.trim();
        if (!val) return;
        try {
            let formatted = '';
            const lang = codeLang.value;

            if (lang === 'json') {
                formatted = JSON.stringify(JSON.parse(val), null, 4);
            } else if (lang === 'html') {
                formatted = formatHTML(val);
            } else if (lang === 'python') {
                formatted = formatPython(val);
            } else if (lang === 'sql') {
                formatted = val.replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|INSERT|UPDATE|DELETE)\b/gi, '\n$1');
            } else {
                formatted = formatBracedCode(val);
            }

            codeOutput.value = formatted;
            saveHistory(`Code Formatter (${lang.toUpperCase()})`, formatted, val);
        } catch (e) {
            codeOutput.value = `Error formatting ${codeLang.value.toUpperCase()} code:\n` + e.message;
        }
    });

    on('btnMinifyCode', 'click', () => {
        if (!codeInput || !codeOutput || !codeLang) return;
        const val = codeInput.value.trim();
        if (!val) return;
        try {
            if (codeLang.value === 'json') {
                codeOutput.value = JSON.stringify(JSON.parse(val));
            } else {
                codeOutput.value = val.replace(/\s+/g, ' ').replace(/\s*([\{\}\:\;\,\<])\s*/g, '$1').trim();
            }
        } catch (e) {
            codeOutput.value = 'Error minifying code: ' + e.message;
        }
    });

    on('btnCopyCode', 'click', () => {
        if (codeOutput && codeOutput.value) {
            navigator.clipboard.writeText(codeOutput.value);
            showToast('📋 Code copied to clipboard!');
        }
    });

    on('btnClearCode', 'click', () => {
        if (codeInput) codeInput.value = '';
        if (codeOutput) codeOutput.value = '';
    });

    // 6. UTILITIES (BASE64, HASH, JWT, REGEX, CRON, UUID)
    const b64In = document.getElementById('base64Input');
    const b64Out = document.getElementById('base64Output');
    on('btnEncode64', 'click', () => {
        if (!b64In || !b64Out) return;
        b64Out.value = btoa(b64In.value);
        saveHistory('Base64 Encode', b64Out.value, b64In.value);
    });
    on('btnDecode64', 'click', () => {
        if (!b64In || !b64Out) return;
        try {
            b64Out.value = atob(b64In.value);
            saveHistory('Base64 Decode', b64Out.value, b64In.value);
        } catch (e) {
            b64Out.value = "Invalid Base64 format";
        }
    });

    const hashIn = document.getElementById('hashInput');
    const hashOut = document.getElementById('hashOutput');
    hashIn?.addEventListener('input', async () => {
        if (!hashIn || !hashOut) return;
        if (!hashIn.value) { hashOut.value = ''; return; }
        const msgUint8 = new TextEncoder().encode(hashIn.value);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        hashOut.value = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        saveHistory('Hash Generator', hashOut.value, hashIn.value);
    });

    document.getElementById('jwtInput')?.addEventListener('input', function () {
        const token = this.value.trim();
        const headerOut = document.getElementById('jwtHeader');
        const payloadOut = document.getElementById('jwtPayload');
        if (!headerOut || !payloadOut) return;
        if (!token) { headerOut.value = ''; payloadOut.value = ''; return; }
        try {
            const parts = token.split('.');
            const decode = str => JSON.stringify(JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/'))), null, 4);
            headerOut.value = decode(parts[0]);
            payloadOut.value = decode(parts[1]);
            saveHistory('JWT Decoder', payloadOut.value, token);
        } catch (e) { headerOut.value = "Error parsing header"; payloadOut.value = e.message; }
    });

    function testRegex() {
        const patEl = document.getElementById('regexPattern');
        const flgEl = document.getElementById('regexFlags');
        const txtEl = document.getElementById('regexInput');
        const output = document.getElementById('regexMatches');
        if (!patEl || !flgEl || !txtEl || !output) return;

        const pattern = patEl.value;
        const flags = flgEl.value;
        const text = txtEl.value;
        if (!pattern || !text) { output.innerHTML = '<em>No input</em>'; return; }
        try {
            const matches = [...text.matchAll(new RegExp(pattern, flags))];
            output.innerHTML = matches.length === 0 ? '<span class="text-secondary">No matches found.</span>' :
                matches.map((m, i) => `<div><strong>Match ${i + 1}:</strong> ${escapeHtml(m[0])}</div>`).join('');
        } catch (e) { output.innerHTML = `<span class="text-danger">${escapeHtml(e.message)}</span>`; }
    }
    document.getElementById('regexPattern')?.addEventListener('input', testRegex);
    document.getElementById('regexFlags')?.addEventListener('input', testRegex);
    document.getElementById('regexInput')?.addEventListener('input', testRegex);

    const cronIn = document.getElementById('cronInput');
    const cronOut = document.getElementById('cronOutput');
    function parseCron() {
        if (!cronIn || !cronOut) return;
        const parts = cronIn.value.trim().split(/\s+/);
        if (parts.length !== 5) { cronOut.value = "Requires 5 fields (minute hour day month day-of-week)"; return; }
        cronOut.value = `Runs at minute [${parts[0]}], hour [${parts[1]}], day-of-month [${parts[2]}], month [${parts[3]}], day-of-week [${parts[4]}].`;
    }
    cronIn?.addEventListener('input', parseCron);
    if (cronIn) parseCron();

    on('#btnGenUuid', 'click', function () {
        const uuids = Array.from({ length: 5 }, () => crypto.randomUUID());
        const uOut = document.getElementById('uuidOutput');
        if (uOut) uOut.value = uuids.join('\n');
        saveHistory('UUID v4 Generator', uuids.join('\n'));
    });

    // 7. API TESTER & ENCRYPTION SHARING LOGIC
    const apiMethod = document.getElementById('apiMethod');
    const apiUrl = document.getElementById('apiUrl');
    const apiHeaders = document.getElementById('apiHeaders');
    const apiRequestBody = document.getElementById('apiRequestBody');
    const ApiResponseOutput = document.getElementById('ApiResponseOutput');
    const apiStatus = document.getElementById('apiStatus');

    document.getElementById('btnSendApi')?.addEventListener('click', async () => {
        const url = apiUrl?.value.trim();
        const method = apiMethod?.value;
        const headersText = apiHeaders?.value.trim();
        const bodyText = apiRequestBody?.value.trim();

        if (!url) {
            showToast('Please enter a valid endpoint URL.', 'error');
            return;
        }

        ApiResponseOutput.value = "Sending request...";
        apiStatus.textContent = "Status: Loading...";
        apiStatus.className = "text-info";

        let requestHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (headersText) {
            try {
                const customHeaders = JSON.parse(headersText);
                requestHeaders = { ...requestHeaders, ...customHeaders };
            } catch (e) {
                ApiResponseOutput.value = "Error: Request Headers must be valid JSON.";
                apiStatus.textContent = "Status: Error (Invalid Headers JSON)";
                apiStatus.className = "text-danger";
                return;
            }
        }

        const options = {
            method: method,
            headers: requestHeaders
        };

        if (['POST', 'PUT', 'PATCH'].includes(method) && bodyText) {
            try {
                options.body = JSON.stringify(JSON.parse(bodyText));
            } catch (e) {
                ApiResponseOutput.value = "Error: Request body must be valid JSON.";
                apiStatus.textContent = "Status: Error (Invalid JSON Body)";
                apiStatus.className = "text-danger";
                return;
            }
        }

        try {
            const startTime = performance.now();
            const response = await fetch(url, options);
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);

            const textData = await response.text();
            let prettyData = textData;
            try {
                prettyData = JSON.stringify(JSON.parse(textData), null, 4);
            } catch (err) { }

            ApiResponseOutput.value = prettyData;
            apiStatus.textContent = `Status: ${response.status} ${response.statusText} (${duration}ms)`;
            apiStatus.className = response.ok ? "text-success" : "text-danger";

            saveHistory('API Test', `${method} ${url} [${response.status}]`, bodyText);
        } catch (error) {
            ApiResponseOutput.value = "Fetch Error: " + error.message + "\n\n(Note: Ensure the API supports CORS headers).";
            apiStatus.textContent = "Status: Network Error / CORS Blocked";
            apiStatus.className = "text-danger";
        }
    });

    function str2ab(str) {
        const buf = new ArrayBuffer(str.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    function ab2base64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    document.getElementById('btnShareEncryptedApi')?.addEventListener('click', async () => {
        const customPassword = await showPasswordPrompt("Secure API Link", "Enter a custom password/passphrase for this shared link:");
        if (!customPassword) return;

        const state = {
            m: apiMethod?.value,
            u: apiUrl?.value,
            h: apiHeaders?.value,
            b: apiRequestBody?.value
        };

        try {
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));

            const enc = new TextEncoder();
            const baseKey = await window.crypto.subtle.importKey(
                "raw",
                enc.encode(customPassword),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            const key = await window.crypto.subtle.deriveKey(
                { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
                baseKey,
                { name: "AES-GCM", length: 256 },
                true,
                ["encrypt", "decrypt"]
            );

            const encryptedContent = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                str2ab(JSON.stringify(state))
            );

            const cipherPayload = encodeURIComponent(ab2base64(encryptedContent));
            const ivPayload = encodeURIComponent(ab2base64(iv));
            const saltPayload = encodeURIComponent(ab2base64(salt));

            const secureQuery = `?enc=${cipherPayload}&iv=${ivPayload}&s=${saltPayload}`;
            const shareUrl = `${window.location.origin}/api-tester${secureQuery}`;

            navigator.clipboard.writeText(shareUrl);
            showToast('🔒 Password-protected link copied to clipboard!');
        } catch (err) {
            console.error("Encryption failed", err);
            showToast('Failed to encrypt request state.', 'error');
        }
    });

    function base642ab(base64) {
        const fixedBase64 = base64.replace(/ /g, '+');
        const binaryString = atob(fixedBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Decrypt API State if query params exist on load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('enc') && urlParams.has('iv') && urlParams.has('s')) {
        (async () => {
            try {
                const cipherBase64 = urlParams.get('enc');
                const ivBase64 = urlParams.get('iv');
                const saltBase64 = urlParams.get('s');

                let decryptedSuccessfully = false;
                let promptMessage = "This shared API link is password-protected. Enter the password:";

                while (!decryptedSuccessfully) {
                    const customPassword = await showPasswordPrompt("Unlock API Link", promptMessage);
                    if (!customPassword) return;

                    try {
                        const enc = new TextEncoder();
                        const baseKey = await window.crypto.subtle.importKey(
                            "raw",
                            enc.encode(customPassword),
                            { name: "PBKDF2" },
                            false,
                            ["deriveKey"]
                        );

                        const key = await window.crypto.subtle.deriveKey(
                            {
                                name: "PBKDF2",
                                salt: new Uint8Array(base642ab(saltBase64)),
                                iterations: 100000,
                                hash: "SHA-256"
                            },
                            baseKey,
                            { name: "AES-GCM", length: 256 },
                            true,
                            ["decrypt"]
                        );

                        const decryptedContent = await window.crypto.subtle.decrypt(
                            { name: "AES-GCM", iv: new Uint8Array(base642ab(ivBase64)) },
                            key,
                            base642ab(cipherBase64)
                        );

                        const decodedString = new TextDecoder().decode(decryptedContent);
                        const state = JSON.parse(decodedString);

                        if (apiMethod) apiMethod.value = state.m || 'GET';
                        if (apiUrl) apiUrl.value = state.u || '';
                        if (apiHeaders) apiHeaders.value = state.h || '';
                        if (apiRequestBody) apiRequestBody.value = state.b || '';

                        navigateTo('/api-tester');
                        decryptedSuccessfully = true;
                    } catch (e) {
                        promptMessage = "⚠️ Incorrect password. Please try again:";
                        showToast('⚠️ Incorrect password.', 'error');
                    }
                }
            } catch (error) {
                console.error("Setup failed", error);
            }
        })();
    }

    // Postman Collection Export
    document.getElementById('btnExportApiPostman')?.addEventListener('click', () => {
        const method = apiMethod?.value || 'GET';
        const url = apiUrl?.value || '';
        const headersText = apiHeaders?.value || '';
        const bodyText = apiRequestBody?.value || '';

        let headerItems = [];
        try {
            if (headersText) {
                const parsedHeaders = JSON.parse(headersText);
                headerItems = Object.entries(parsedHeaders).map(([key, value]) => ({ key, value }));
            }
        } catch (e) {
            console.warn("Headers are not valid JSON, exporting headers as empty.");
        }

        const postmanCollection = {
            "info": {
                "name": "devZtoolkit Exported Collection",
                "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            "item": [
                {
                    "name": url ? `${method} - ${url}` : "API Request",
                    "request": {
                        "method": method,
                        "header": headerItems,
                        "body": bodyText ? {
                            "mode": "raw",
                            "raw": bodyText,
                            "options": {
                                "raw": { "language": "json" }
                            }
                        } : undefined,
                        "url": { "raw": url }
                    }
                }
            ]
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(postmanCollection, null, 4));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "devztoolkit-collection.postman_collection.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        showToast('📦 Postman Collection downloaded successfully!');
    });

});