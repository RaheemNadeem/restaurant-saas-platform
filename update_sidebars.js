const fs = require('fs');
const path = require('path');

const OLD_SIDEBAR_SNIPPET = `            <div>
                <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"><span
                            class="text-xs font-semibold text-primary">AS</span></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-800 truncate">Ayesha Rahman</p>
                        <p class="text-xs text-gray-400">Owner</p>
                    </div>
                </div>
                <button class="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 w-full"><svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>Log out</button>
            </div>`;

// Or the single quotes version just in case
const NEW_SIDEBAR_SNIPPET = `            <div>
                <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer mb-2">
                    <div class="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center"><span
                            class="text-xs font-semibold text-primary">AS</span></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 truncate font-outfit">Ayesha Rahman</p>
                        <p class="text-xs text-gray-500">Owner</p>
                    </div>
                </div>
                <button class="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary-soft rounded-lg transition-colors w-full"><svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>Log out</button>
            </div>`;

function replaceSidebar(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Due to whitespace variations, doing a looser regex match for the block
    const regex = /<div>\s*<div class="flex items-center gap-3 px-3 py-2\.5 rounded-lg hover:bg-gray-50 cursor-pointer">\s*<div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"><span\s*class="text-xs font-semibold text-primary">AS<\/span><\/div>\s*<div class="flex-1 min-w-0">\s*<p class="text-sm font-medium text-gray-800 truncate">Ayesha Rahman<\/p>\s*<p class="text-xs text-gray-400">Owner<\/p>\s*<\/div>\s*<\/div>\s*<button class="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 w-full"><svg\s*width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\s*<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" \/>\s*<polyline points="16 17 21 12 16 7" \/>\s*<line x1="21" x2="9" y1="12" y2="12" \/>\s*<\/svg>Log out<\/button>\s*<\/div>/g;

    if (regex.test(content)) {
        content = content.replace(regex, NEW_SIDEBAR_SNIPPET);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated sidebar in: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            replaceSidebar(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'quickserve-ui'));
console.log('Finished updating sidebars.');
