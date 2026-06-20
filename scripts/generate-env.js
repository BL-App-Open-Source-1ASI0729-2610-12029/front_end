const fs = require('fs');
const path = require('path');

const DEFAULT_API_URL = 'https://domoticore-api.onrender.com/api/v1';
const apiUrl = process.env.NG_APP_API_URL || DEFAULT_API_URL;
const target = path.join(__dirname, '../src/environments/environment.production.ts');

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl.replace(/'/g, "\\'")}',
};
`;

fs.writeFileSync(target, content);
console.log(`Generated environment.production.ts (apiUrl: ${apiUrl || '(static mock data)'})`);
