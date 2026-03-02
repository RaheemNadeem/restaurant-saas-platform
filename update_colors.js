const fs = require('fs');
const path = require('path');

function replaceColors(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace usages of red-600 with the primary color token (red-500 or just generic background styles leaning to primary)
    // Actually tailwind-config.js defines 'primary' as '#EF4444' which WE SHOULD USE directly via 'bg-primary', 'text-primary'

    // Replace red-600 with primary
    content = content.replace(/text-red-600/g, 'text-primary');
    content = content.replace(/bg-red-600/g, 'bg-primary');
    content = content.replace(/border-red-600/g, 'border-primary');
    content = content.replace(/ring-red-600/g, 'ring-primary');

    // Replace red-700 with primary-hover
    content = content.replace(/text-red-700/g, 'text-primary-hover');
    content = content.replace(/bg-red-700/g, 'bg-primary-hover');
    content = content.replace(/border-red-700/g, 'border-primary-hover');
    content = content.replace(/ring-red-700/g, 'ring-primary-hover');

    // Replace red-50 with primary-soft
    content = content.replace(/text-red-50/g, 'text-primary-soft');
    content = content.replace(/bg-red-50/g, 'bg-primary-soft');
    content = content.replace(/border-red-50/g, 'border-primary-soft');

    // Replace red-100/200/400 conceptually (might need manual check but let's map common ones)
    content = content.replace(/text-red-200/g, 'text-red-200'); // Leave standard tailwind for now, just focused on primary brand
    content = content.replace(/hover:bg-red-100/g, 'hover:bg-primary-soft');

    fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            replaceColors(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'quickserve-ui'));
console.log('Finished updating colors to semantic tokens.');
