const fs = require('fs');
const data = JSON.parse(fs.readFileSync('MOHAMMED_RAHEEM_Enterprise_AI_Platform_FLOW.pen', 'utf8'));

const out = {};

if (data.variables) {
    out.variables = data.variables;
}

if (data.children && data.children.length > 0) {
    out.children_types = data.children.map(c => c.type);

    // Find interesting things in children
    const colors = new Set();
    const textStyles = new Set();

    function traverse(node) {
        if (node.fills) {
            node.fills.forEach(f => {
                if (f.fillColor) colors.add(f.fillColor);
                if (f.color) colors.add(f.color);
            });
        }
        if (node.strokes) {
            node.strokes.forEach(s => {
                if (s.fillColor) colors.add(s.fillColor);
                if (s.color) colors.add(s.color);
            });
        }
        if (node.typography || node.fontFamily) {
            textStyles.add(JSON.stringify({
                fontFamily: node.fontFamily,
                fontSize: node.fontSize,
                fontWeight: node.fontWeight,
                lineHeight: node.lineHeight
            }));
        }
        if (node.children) {
            node.children.forEach(traverse);
        }
    }

    data.children.forEach(traverse);
    out.extracted_colors = Array.from(colors);
    out.extracted_textStyles = Array.from(textStyles).map(s => JSON.parse(s));
}

fs.writeFileSync('presets_info2.json', JSON.stringify(out, null, 2));
