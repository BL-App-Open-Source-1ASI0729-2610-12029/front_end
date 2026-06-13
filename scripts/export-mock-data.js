const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');
const outDir = path.join(__dirname, '../public/mock-data');

const keys = [
  'users',
  'devices-overview',
  'device-details',
  'activity-streams',
  'history-summary',
  'security-cameras',
  'smart-locks',
  'authorized-users',
  'security-log',
  'notification-feed',
  'history-insights',
  'automation-recipe',
  'automation-builder-triggers',
  'automation-builder-conditions',
  'automation-builder-actions',
  'automation-suggested-templates',
  'user-profile',
];

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

keys.forEach(key => {
  if (db[key] === undefined) return;
  fs.writeFileSync(
    path.join(outDir, `${key}.json`),
    JSON.stringify(db[key], null, 2),
  );
});

console.log('Exported mock data to public/mock-data/');
