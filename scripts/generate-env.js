const fs = require('fs');
const path = require('path');

const apiUrl = process.env.NG_APP_API_URL || '';
const target = path.join(__dirname, '../src/environments/environment.production.ts');

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl.replace(/'/g, "\\'")}',
};
`;

fs.writeFileSync(target, content);
console.log(`Generated environment.production.ts (apiUrl: ${apiUrl || '(static mock data)'})`);
