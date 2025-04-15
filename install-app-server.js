#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Running Railway installation helper script');
console.log('Current working directory:', process.cwd());

// Make sure /app directory exists
try {
  if (!fs.existsSync('/app')) {
    console.log('Creating /app directory');
    fs.mkdirSync('/app', { recursive: true });
  }
} catch (e) {
  console.error('Error creating /app directory:', e);
}

// Copy our app-server.js to /app/server.js
try {
  const sourcePath = path.join(process.cwd(), 'app-server.js');
  if (fs.existsSync(sourcePath)) {
    console.log(`Copying ${sourcePath} to /app/server.js`);
    fs.copyFileSync(sourcePath, '/app/server.js');
    console.log('File copied successfully');
  } else {
    console.error(`Source file not found: ${sourcePath}`);

    // If the app-server.js doesn't exist, create a basic one directly
    console.log('Creating basic server.js directly at /app/server.js');
    const basicServer = `
// Basic server.js created by install script
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ status: 'running' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(\`Server running on port \${port}\`);
});
`;

    fs.writeFileSync('/app/server.js', basicServer);
    console.log('Basic server created at /app/server.js');
  }
} catch (e) {
  console.error('Error copying file:', e);
}

// List the contents of /app to verify
try {
  console.log('Contents of /app:');
  fs.readdirSync('/app').forEach((file) => {
    console.log(` - ${file}`);
  });
} catch (e) {
  console.error('Error listing /app directory:', e);
}
