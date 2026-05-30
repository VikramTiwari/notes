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

function extractTitleAndDescription(content) {
    // 1. Extract first H1 heading
    let title = null;
    const lines = content.split(/\r?\n/);
    for (let line of lines) {
        const cleanLine = line.trim();
        if (cleanLine.startsWith('# ')) {
            title = cleanLine.substring(2).trim();
            break;
        }
    }

    // 2. Extract first body paragraph
    let description = null;
    let insideFrontmatter = false;
    let yamlLines = 0;
    
    for (let line of lines) {
        const cleanLine = line.trim();
        
        // Skip frontmatter block
        if (cleanLine === '---') {
            yamlLines++;
            insideFrontmatter = (yamlLines % 2 === 1);
            continue;
        }
        if (insideFrontmatter) continue;

        // Skip headers, empty lines, HTML tags/comments, code blocks, lists, blockquotes, images
        if (!cleanLine || 
            cleanLine.startsWith('#') || 
            cleanLine.startsWith('<') || 
            cleanLine.startsWith('-->') || 
            cleanLine.startsWith('<!--') || 
            cleanLine.startsWith('`') || 
            cleanLine.startsWith('*') || 
            cleanLine.startsWith('-') || 
            cleanLine.startsWith('>') || 
            cleanLine.startsWith('[') ||
            cleanLine.startsWith('![')) {
            continue;
        }

        // Found the first body paragraph!
        // Clean markdown formatting: strip asterisks, clean links [text](url) to text
        let text = cleanLine
            .replace(/\*\*?/g, '') // remove * and **
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // remove links, keep text
            .replace(/`([^`]+)`/g, '$1') // remove code formatting
            .trim();

        if (text.length > 10) {
            // Truncate to ~150 chars ending in a clean word
            if (text.length > 150) {
                const truncated = text.substring(0, 150);
                const lastSpace = truncated.lastIndexOf(' ');
                text = (lastSpace > 120 ? truncated.substring(0, lastSpace) : truncated) + '...';
            }
            description = text;
            break;
        }
    }

    return { title, description };
}

function parseFrontmatter(frontmatterContent) {
    const lines = frontmatterContent.split(/\r?\n/);
    const result = {};
    let currentKey = null;
    let currentValueLines = [];
    
    for (let line of lines) {
        // If it starts with space/tab, it is a continuation of the current multiline key
        if (currentKey && /^\s/.test(line)) {
            currentValueLines.push(line);
            continue;
        }
        
        // Otherwise, it might be a new key
        const match = line.match(/^([a-zA-Z0-9_-]+):\s*([\s\S]*)$/);
        if (match) {
            // Save the previous key if there was one
            if (currentKey) {
                result[currentKey] = currentValueLines.join('\n');
            }
            currentKey = match[1];
            currentValueLines = [match[2]];
        } else {
            // If it doesn't match a new key and is empty or non-indented, save previous key and reset
            if (currentKey) {
                result[currentKey] = currentValueLines.join('\n');
                currentKey = null;
                currentValueLines = [];
            }
        }
    }
    
    // Save last key
    if (currentKey) {
        result[currentKey] = currentValueLines.join('\n');
    }
    
    return result;
}

function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if YAML frontmatter exists
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
    const match = content.match(frontmatterRegex);
    
    let frontmatterContent = "";
    let mainBodyContent = content;
    
    if (match) {
        frontmatterContent = match[1];
        mainBodyContent = content.substring(match[0].length);
    }
    
    const result = parseFrontmatter(frontmatterContent);
    
    // Parse existing keys from frontmatterContent
    const hasDate = result.hasOwnProperty('date');
    const hasTitle = result.hasOwnProperty('title');
    const hasDescription = result.hasOwnProperty('description');
    
    // If all three exist, skip processing!
    if (hasDate && hasTitle && hasDescription) {
        return;
    }
    
    let date = null;
    if (hasDate) {
        date = result['date'];
    } else {
        date = getGitCreationDate(filePath);
    }
    
    let title = null;
    if (hasTitle) {
        title = result['title'];
    }
    
    let description = null;
    if (hasDescription) {
        description = result['description'];
    }
    
    // Extract missing metadata from body
    const extracted = extractTitleAndDescription(content);
    if (!title && extracted.title) {
        title = extracted.title;
    }
    if (!description && extracted.description) {
        description = extracted.description;
    }
    
    // Reassemble frontmatter content cleanly
    let newYamlLines = [];
    if (title) {
        if (hasTitle) {
            newYamlLines.push(`title: ${title}`);
        } else {
            const escapedTitle = title.replace(/"/g, '\\"');
            newYamlLines.push(`title: "${escapedTitle}"`);
        }
    }
    if (description) {
        if (hasDescription) {
            newYamlLines.push(`description: ${description}`);
        } else {
            const escapedDesc = description.replace(/"/g, '\\"');
            newYamlLines.push(`description: "${escapedDesc}"`);
        }
    }
    if (date) {
        newYamlLines.push(`date: ${date}`);
    }
    
    const newFrontmatterBlock = `---\n${newYamlLines.join('\n')}\n---\n`;
    const newContent = newFrontmatterBlock + mainBodyContent.trim() + '\n';
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Injected metadata into ${path.relative(NOTES_ROOT, filePath)}`);
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
            if (file === 'SUMMARY.md') return;
            processFile(fullPath);
        }
    });
}

console.log('🏁 Scanning Markdown files to inject Git-based publication dates...');
scanDirectory(NOTES_ROOT);
console.log('🎉 Git dates injected successfully!');
