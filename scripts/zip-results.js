const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = process.cwd();
const outputDir = path.join(rootDir, 'reports');
const outputFile = path.join(outputDir, 'test-artifacts.zip');
const artifactDirs = [
  'screenshoots',
  'test-results',
  'playwright-report',
  'allure-results',
  'allure-report',
].filter((dir) => fs.existsSync(path.join(rootDir, dir)));

if (artifactDirs.length === 0) {
  throw new Error('No artifact folders found to zip.');
}

fs.mkdirSync(outputDir, { recursive: true });

if (fs.existsSync(outputFile)) {
  fs.rmSync(outputFile);
}

const result = spawnSync('zip', ['-r', outputFile, ...artifactDirs], {
  cwd: rootDir,
  stdio: 'inherit',
});

if (result.status !== 0) {
  throw new Error('Failed to create zip file. Make sure the zip command is available.');
}

console.log(`Created ${outputFile}`);
