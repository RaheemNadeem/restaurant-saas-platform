const fs = require('fs');
const path = require('path');

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove inline tailwind configs
    content = content.replace(/<script>\s*tailwind\.config\s*=\s*{[\s\S]*?}\s*<\/script>/gi, '');

    // Add script tag for the central config right after tailwind CDN
    const inPagesDir = filePath.includes(path.sep + 'pages' + path.sep);
    const scriptPath = inPagesDir ? '../tailwind-config.js' : 'tailwind-config.js';

    // Only add if not already present
    if (!content.includes(scriptPath)) {
        content = content.replace(
            /<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/gi,
            `<script src="https://cdn.tailwindcss.com"></script>\n    <script src="${scriptPath}"></script>`
        );
    }

    // Update fonts
    content = content.replace(
        /https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:(wght@.*?)(?:&family=.*?)?&display=swap/g,
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap'
    );
    // Handle cases where the whole link needs replacement if the regex above didn't catch it
    if (!content.includes('family=Outfit')) {
        content = content.replace(
            /<link href="https:\/\/fonts\.googleapis\.com\/css2\?.*?"\s*\n*\s*rel="stylesheet"\s*\/>/gi,
            `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap"\n        rel="stylesheet" />`
        );
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            console.log(`Processing: ${fullPath}`);
            processHtmlFile(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'quickserve-ui'));
console.log('Finished updating HTML files.');
