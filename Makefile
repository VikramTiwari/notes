.PHONY: clean build serve dev deploy submodule-init sync all

# Default target
all: dev

# Clean the local build folder
clean:
	@echo "🧹 Cleaning previous build..."
	rm -rf _book

# Build all components locally (Notes, Home page, and Book Shelf)
# Reuses cached book-shelf/dist build if present to dramatically speed up notes iteration
build: clean
	@echo "🧬 Injecting Git-based publication dates..."
	node scripts/inject-git-dates.js
	@echo "🏗️ Building HonKit notes..."
	npx honkit build ./ _book/notes
	@echo "🏠 Copying Home landing page..."
	mkdir -p _book
	rsync -av --exclude='.git' home/ _book/
	@echo "📚 Preparing Book Shelf application..."
	@if [ -d "book-shelf/dist" ]; then \
		echo "✅ Reusing cached book-shelf/dist build assets..."; \
	else \
		echo "⚙️ book-shelf/dist not found. Compiling Vite sub-app from scratch..."; \
		cd book-shelf && npm install && npx vite build --base=/books/; \
	fi
	mkdir -p _book/books
	cp -r book-shelf/dist/* _book/books/
	@echo "🗺️ Generating Sitemap..."
	node scripts/generate-sitemap.js
	@echo "✅ Build completed successfully!"

# Force a completely clean build including book-shelf Vite compilation
build-force: clean
	@echo "🧬 Injecting Git-based publication dates..."
	node scripts/inject-git-dates.js
	@echo "🏗️ Building HonKit notes..."
	npx honkit build ./ _book/notes
	@echo "🏠 Copying Home landing page..."
	mkdir -p _book
	rsync -av --exclude='.git' home/ _book/
	@echo "⚙️ Forcing Vite compilation for Book Shelf..."
	cd book-shelf && npm install && npx vite build --base=/books/
	mkdir -p _book/books
	cp -r book-shelf/dist/* _book/books/
	@echo "🗺️ Generating Sitemap..."
	node scripts/generate-sitemap.js
	@echo "✅ Full build completed successfully!"

# Serve the site locally using Firebase tools to mirror production routing
serve:
	@echo "🚀 Serving site on http://localhost:4001 ..."
	npx firebase serve --port 4001 --project vik-website

# Build and serve in a single command
dev: build serve

# Initialize and pull submodules recursively
submodule-init:
	@echo "📦 Initializing submodules..."
	git submodule update --init --recursive

# Automatically stage, commit, and push any changes in submodules, then update references
sync:
	@echo "🔄 Checking for changes in home..."
	@cd home && \
	if [ -n "$$(git status --porcelain)" ]; then \
		echo "💾 Staging and committing changes in home..."; \
		git add -A && \
		git commit -m "sync: automatic update" && \
		git push origin master; \
	else \
		echo "✅ home is clean."; \
	fi
	@echo "🔄 Checking for changes in book-shelf..."
	@cd book-shelf && \
	if [ -n "$$(git status --porcelain)" ]; then \
		echo "💾 Staging and committing changes in book-shelf..."; \
		git add -A && \
		git commit -m "sync: automatic update" && \
		git push origin main; \
	else \
		echo "✅ book-shelf is clean."; \
	fi
	@echo "🔄 Checking for updated submodule references in notes..."
	@if [ -n "$$(git status --porcelain home book-shelf)" ]; then \
		echo "💾 Staging and committing updated submodule references in notes..."; \
		git add home book-shelf && \
		git commit -m "chore: update submodule pointers"; \
	else \
		echo "✅ Notes submodule pointers are in sync."; \
	fi

# Run production build and deploy to Firebase (syncs automatically first!)
deploy: sync
	@echo "🚀 Starting full production deployment..."
	node scripts/deploy.js
