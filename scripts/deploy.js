const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(command) {
    console.log(`\n> ${command}`);
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Command failed: ${command}`);
        process.exit(1);
    }
}

function dirExists(dirPath) {
    return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
}

const ROOT_DIR = path.resolve(__dirname, '..');
process.chdir(ROOT_DIR);

console.log('Starting deployment process...');

// 1. Update Home Repo
console.log('\n--- Updating Home Repo ---');
if (dirExists('home/.git')) {
    run('cd home && git pull origin master');
} else {
    run('git clone git@github.com:VikramTiwari/vikramtiwari.github.com.git home');
}

// 2. Update Book Shelf Repo
console.log('\n--- Updating Book Shelf Repo ---');
if (dirExists('book-shelf/.git')) {
    run('cd book-shelf && git fetch origin && git reset --hard origin/main');
} else {
    run('git clone https://github.com/VikramTiwari/book-shelf book-shelf');
}

// 3. Build Docs (HonKit)
console.log('\n--- Building Docs ---');
// Using the existing npm script for docs build which handles cleaning and rsyncing home
run('npm run docs:build');

// 4. Build Book Shelf
console.log('\n--- Building Book Shelf ---');
run('cd book-shelf && npm install && npx vite build --base=/books/');

// 5. Prepare Book Shelf Deployment
console.log('\n--- Preparing Book Shelf for Deployment ---');
run('mkdir -p _book/books');
run('cp -r book-shelf/dist/* _book/books/');

// 6. Generate Sitemap
console.log('\n--- Generating Sitemap ---');
run('node scripts/generate-sitemap.js');

// 7. Deploy to Firebase
console.log('\n--- Deploying to Firebase ---');
run('npx firebase-tools deploy --project vik-website');

console.log('\nDeployment completed successfully!');
