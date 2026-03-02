const fs = require('fs');
const data = JSON.parse(fs.readFileSync('MOHAMMED_RAHEEM_Enterprise_AI_Platform_FLOW.pen', 'utf8'));
const out = {
  keys: Object.keys(data)
};
['colors', 'typography', 'presets', 'styles', 'tokens', 'document', 'pages', 'themes', 'typographies'].forEach(k => {
  out[k + '_exists'] = !!data[k];
  if (data[k]) {
     if (Array.isArray(data[k])) out[k + '_count'] = data[k].length;
     else out[k + '_keys'] = Object.keys(data[k]);
  }
});
fs.writeFileSync('presets_info.json', JSON.stringify(out, null, 2));
