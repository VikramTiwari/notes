.PHONY: clean build serve dev deploy all

# Default target
all: dev

# Clean the local build folder
clean:
	@echo "🧹 Cleaning previous build..."
	rm -rf _book

# Build all components locally (Notes, Home page, and Book Shelf)
build: clean
	@echo "🏗️ Building HonKit notes..."
	npx honkit build ./ _book/notes
	@echo "🏠 Copying Home landing page..."
	mkdir -p _book
	rsync -av --exclude='.git' home/ _book/
	@echo "📚 Building Book Shelf Vite application..."
	cd book-shelf && npm install && npx vite build --base=/books/
	mkdir -p _book/books
	cp -r book-shelf/dist/* _book/books/
	@echo "🗺️ Generating Sitemap..."
	node scripts/generate-sitemap.js
	@echo "✅ Build completed successfully!"

# Serve the site locally using Firebase tools to mirror production routing
serve:
	@echo "🚀 Serving site on http://localhost:4001 ..."
	npx firebase serve --port 4001 --project vik-website

# Build and serve in a single command
dev: build serve

# Run production build and deploy to Firebase
deploy:
	@echo "🚀 Starting full production deployment..."
	node scripts/deploy.js
