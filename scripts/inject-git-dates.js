const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const NOTES_ROOT = path.resolve(__dirname, '..');
const EXCLUDES = [
    'node_modules', 
    '_book', 
    '.git', 
    '.firebase', 
    '.gitbook', 
    'scripts', 
    'home', 
    'book-shelf'
];

function getGitCreationDate(filePath) {
    try {
        const relPath = path.relative(NOTES_ROOT, filePath);
        // Run git log to find the date the file was first added to Git
        const output = execSync(`git log --diff-filter=A --format=%as -- "${relPath}"`, { 
            cwd: NOTES_ROOT, 
            encoding: 'utf8' 
        }).trim();
        
        if (output && /^\d{4}-\d{2}-\d{2}$/.test(output)) {
            return output;
        }
    } catch (e) {
        // Fallback below on catch or empty result
    }
    // Fallback to today's date if file is untracked/new
    return new Date().toISOString().split('T')[0];
}

function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
    const match = content.match(frontmatterRegex);
    
    let date = null;
    let newContent = content;

    if (match) {
        const frontmatterContent = match[1];
        // Check if date already exists
        if (/^date:\s*/m.test(frontmatterContent)) {
            return; // Date exists, skip
        }
        
        date = getGitCreationDate(filePath);
        const updatedFrontmatterContent = frontmatterContent.trim() + `\ndate: ${date}`;
        const newFrontmatterBlock = `---\n${updatedFrontmatterContent}\n---\n`;
        newContent = content.replace(match[0], newFrontmatterBlock);
    } else {
        // No frontmatter block exists, create one
        date = getGitCreationDate(filePath);
        newContent = `---\ndate: ${date}\n---\n\n` + content;
    }

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Injected publication date ${date} into ${path.relative(NOTES_ROOT, filePath)}`);
}

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (EXCLUDES.includes(file)) return;
        
        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (file.endsWith('.md')) {
            // Ignore system/summary files
            if (file === 'SUMMARY.md' || file === 'help-me.md') return;
            processFile(fullPath);
        }
    });
}

console.log('🏁 Scanning Markdown files to inject Git-based publication dates...');
scanDirectory(NOTES_ROOT);
console.log('🎉 Git dates injected successfully!');
