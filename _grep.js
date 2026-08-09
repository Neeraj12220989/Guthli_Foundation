const fs = require('fs');
const css = fs.readFileSync('d:/Deep Fake/guthli-foundation/style.css', 'utf8');
const lines = css.split('\n');
const keywords = ['independence-banner','banner-strip','banner-content','banner-text','banner-close','banner-ashoka','careers','jobs-grid','job-card','careers-cta','apply-cta-btn','careers-intro','events','event-card','banner'];
const idx = {};
lines.forEach((l, i) => {
  keywords.forEach(k => {
    if (l.includes(k)) {
      if (!idx[k]) idx[k] = [];
      idx[k].push(i + 1);
    }
  });
});
Object.keys(idx).forEach(k => {
  console.log('\n### ' + k + ' (lines: ' + idx[k].join(', ') + ')');
});
