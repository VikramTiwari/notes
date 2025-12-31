const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://vikramtiwari.com';
const NOTES_ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.resolve(__dirname, '../_book/sitemap.xml');
const BOOK_DATA_PATH = path.resolve(__dirname, '../book-shelf/public/data.csv');
const HOME_DIR = path.resolve(__dirname, '../home');

// Directories to exclude when scanning for notes
const EXCLUDES = [
    'node_modules', 
    '_book', 
    '.git', 
    '.firebase', 
    '.gitbook', 
    'scripts', 
    'home', 
    'book-shelf', 
    'dist',
    'public' // in case there's one in root
];

// Helper to get formatted date YYYY-MM-DD
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

const today = getTodayDate();
const urls = [];

function addUrl(loc, priority = 0.5, changefreq = 'weekly') {
    urls.push(`
    <url>
        <loc>${loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority.toFixed(1)}</priority>
    </url>`);
}

// 1. Root Website (from home directory)
console.log('Scanning Home...');
if (fs.existsSync(HOME_DIR)) {
    // Always add root
    addUrl(`${DOMAIN}/`, 1.0, 'daily');
    
    // Scan for other html files
    const homeFiles = fs.readdirSync(HOME_DIR);
    homeFiles.forEach(file => {
        if (file.endsWith('.html') && file !== 'index.html' && !file.startsWith('google')) {
             addUrl(`${DOMAIN}/${file}`, 0.8);
        }
    });
}

// 2. Notes (Markdown files)
console.log('Scanning Notes...');
function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (EXCLUDES.includes(file)) return;
        
        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (file.endsWith('.md')) {
            // Ignore special files
            if (file === 'SUMMARY.md' || file === 'help-me.md') return;
            
            // Calculate relative path from NOTES_ROOT
            let relPath = path.relative(NOTES_ROOT, fullPath);
            
            // HonKit build logic: 
            // README.md in root -> /notes/index.html (Wait, docs:build outputs to _book/notes)
            // So everything is under /notes/
            
            let urlPath = relPath.replace('.md', '.html');
            if (path.basename(file) === 'README.md') {
                urlPath = urlPath.replace('README.html', 'index.html');
            }
            
            // The build puts everything into _book/notes, so the URL is vikramtiwari.com/notes/...
            addUrl(`${DOMAIN}/notes/${urlPath}`, 0.7);
        }
    });
}

scanDirectory(NOTES_ROOT);

// 3. Books (Static)
console.log('Adding Books routes...');
addUrl(`${DOMAIN}/books/`, 0.8, 'daily');
addUrl(`${DOMAIN}/books/db`, 0.8, 'daily');

// Generate XML
const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

// Ensure output dir exists (in case it runs standalone)
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, xmlContent);
console.log(`Sitemap generated with ${urls.length} URLs at ${OUTPUT_FILE}`);
