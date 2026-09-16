(function(window) {
  var searchIndex = {
    sidebar: [],
    page: []
  };

  var selectedIndex = -1;
  var visibleItems = [];

  function slugify(text) {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function highlightMatches(text, query) {
    if (!query) return escapeHtml(text);
    var regex = new RegExp("(" + escapeRegex(query) + ")", "gi");
    return escapeHtml(text).replace(regex, "<mark class=\"search-hl\">$1</mark>");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 1. Build Index of Sidebar Links
  function indexSidebar() {
    searchIndex.sidebar = [];
    var links = document.querySelectorAll(".book-summary ul.summary li a");
    links.forEach(function(a) {
      var href = a.getAttribute("href");
      var text = (a.innerText || a.textContent || "").trim();
      if (!href || href === "#" || !text) return;
      if (a.classList.contains("sidebar-back-btn")) return;

      // Deduce category from parent list or preceding header
      var category = "";
      var parentLi = a.closest("li");
      if (parentLi) {
        var parentUl = parentLi.closest("ul.articles");
        if (parentUl && parentUl.parentElement) {
          var categoryLink = parentUl.parentElement.querySelector(":scope > a, :scope > span");
          if (categoryLink) {
            category = categoryLink.innerText.trim();
          }
        }
      }

      // If no category yet, search for preceding header li
      if (!category && parentLi) {
        var prev = parentLi.previousElementSibling;
        while (prev) {
          if (prev.classList.contains("header")) {
            category = prev.innerText.trim();
            break;
          }
          prev = prev.previousElementSibling;
        }
      }

      searchIndex.sidebar.push({
        title: text,
        url: href,
        category: category || "Notes"
      });
    });
  }

  // 2. Build Index of Currently Visible Page
  function indexCurrentPage() {
    searchIndex.page = [];
    var contentArea = document.querySelector(".markdown-section");
    if (!contentArea) return;

    var headings = contentArea.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach(function(h, idx) {
      var text = (h.innerText || h.textContent || "").trim();
      if (!text) return;
      
      if (!h.id) {
        var baseSlug = slugify(text) || "heading";
        h.id = baseSlug + "-" + idx;
      }

      searchIndex.page.push({
        type: "heading",
        level: h.tagName.toUpperCase(),
        title: text,
        id: h.id,
        element: h
      });
    });

    // Index key body paragraphs and list items for granular search
    var paragraphs = contentArea.querySelectorAll("p, li, blockquote");
    var paraCount = 0;
    paragraphs.forEach(function(el) {
      if (el.closest("pre") || el.closest("table") || el.closest("script")) return;
      var text = (el.innerText || el.textContent || "").trim();
      // Only index meaningful paragraphs
      if (text.length < 20 || text.length > 600) return;

      if (!el.id) {
        el.id = "doc-p-" + (paraCount++);
      }

      // Find closest heading above this paragraph
      var precedingHeading = "";
      var prev = el.previousElementSibling;
      while (prev) {
        if (/^H[1-6]$/i.test(prev.tagName)) {
          precedingHeading = prev.innerText.trim();
          break;
        }
        prev = prev.previousElementSibling;
      }

      searchIndex.page.push({
        type: "paragraph",
        context: precedingHeading,
        text: text,
        id: el.id,
        element: el
      });
    });
  }

  // 3. Highlight Element on Page when Jumped to
  function pulseHighlight(el) {
    if (!el) return;
    el.classList.remove("search-target-highlight");
    // Trigger reflow to restart animation
    void el.offsetWidth;
    el.classList.add("search-target-highlight");
    setTimeout(function() {
      el.classList.remove("search-target-highlight");
    }, 2800);
  }

  // 4. Main Search Dialog Manager
  function initializeSearch() {
    var dialog = document.getElementById("notes-search-dialog");
    var input = document.getElementById("modal-search-input");
    var resultsContainer = document.getElementById("modal-search-results");
    var triggerBtn = document.getElementById("header-search-trigger");
    var closeBtn = document.querySelector(".modal-search-close-btn");

    if (!dialog || !input || !resultsContainer) return;

    // Index content
    indexSidebar();
    indexCurrentPage();

    function openSearch() {
      // Re-index current page to ensure freshest DOM references
      indexCurrentPage();
      
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
      
      input.value = "";
      renderInitialState();
      selectedIndex = -1;
      visibleItems = [];
      setTimeout(function() {
        input.focus();
      }, 50);
    }

    function closeSearch() {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
      input.value = "";
      selectedIndex = -1;
      visibleItems = [];
    }

    // Light-dismiss fallback for Safari / browsers without closedby support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', function(event) {
        if (event.target !== dialog) return;
        var rect = dialog.getBoundingClientRect();
        var isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          closeSearch();
        }
      });
    }

    // Trigger button
    if (triggerBtn && !triggerBtn.hasAttribute("data-search-bound")) {
      triggerBtn.setAttribute("data-search-bound", "true");
      triggerBtn.addEventListener("click", function(e) {
        e.preventDefault();
        openSearch();
      });
    }

    // Close button
    if (closeBtn && !closeBtn.hasAttribute("data-search-bound")) {
      closeBtn.setAttribute("data-search-bound", "true");
      closeBtn.addEventListener("click", function(e) {
        e.preventDefault();
        closeSearch();
      });
    }

    // Global keyboard listener for '/' and 'Cmd+K' / 'Ctrl+K'
    if (!window._notesSearchKeyBound) {
      window._notesSearchKeyBound = true;
      window.addEventListener("keydown", function(e) {
        var tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
        var isEditable = document.activeElement && (
          document.activeElement.isContentEditable ||
          tag === "input" ||
          tag === "textarea" ||
          tag === "select"
        );

        // Shortcut 1: Slash '/' (when not typing in a form field)
        if (e.key === "/" && !isEditable && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          openSearch();
          return;
        }

        // Shortcut 2: Cmd+K / Ctrl+K
        if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
          e.preventDefault();
          if (dialog.open) {
            closeSearch();
          } else {
            openSearch();
          }
          return;
        }
      });
    }

    function renderInitialState() {
      resultsContainer.innerHTML = `
        <div class="modal-search-initial-state">
          <p>Type to search across <strong>this page</strong> and the <strong>sidebar</strong></p>
          <div class="modal-search-tips">
            <span><kbd>/</kbd> anywhere to open</span>
            <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
            <span><kbd>ESC</kbd> to dismiss</span>
          </div>
        </div>
      `;
    }

    function updateSelection(index) {
      if (visibleItems.length === 0) return;
      if (index < 0) index = 0;
      if (index >= visibleItems.length) index = visibleItems.length - 1;
      
      selectedIndex = index;
      visibleItems.forEach(function(item, i) {
        if (i === selectedIndex) {
          item.classList.add("selected");
          item.scrollIntoView({ block: "nearest", behavior: "smooth" });
        } else {
          item.classList.remove("selected");
        }
      });
    }

    // 5. Query & Render Matching Results
    function handleSearch() {
      var query = input.value.trim().toLowerCase();
      if (!query) {
        renderInitialState();
        selectedIndex = -1;
        visibleItems = [];
        return;
      }

      // A. Match Current Page
      var pageMatches = [];
      searchIndex.page.forEach(function(item) {
        if (item.type === "heading") {
          if (item.title.toLowerCase().indexOf(query) !== -1) {
            pageMatches.push(item);
          }
        } else if (item.type === "paragraph") {
          if (item.text.toLowerCase().indexOf(query) !== -1) {
            pageMatches.push(item);
          }
        }
      });
      // Cap page matches to 8 highest signal items
      pageMatches = pageMatches.slice(0, 8);

      // B. Match Sidebar
      var sidebarMatches = [];
      searchIndex.sidebar.forEach(function(item) {
        var titleMatch = item.title.toLowerCase().indexOf(query) !== -1;
        var catMatch = item.category.toLowerCase().indexOf(query) !== -1;
        if (titleMatch || catMatch) {
          sidebarMatches.push({
            title: item.title,
            url: item.url,
            category: item.category,
            starts: item.title.toLowerCase().startsWith(query)
          });
        }
      });
      // Sort sidebar matches (prefix matches first)
      sidebarMatches.sort(function(a, b) {
        if (a.starts && !b.starts) return -1;
        if (!a.starts && b.starts) return 1;
        return 0;
      });
      sidebarMatches = sidebarMatches.slice(0, 12);

      // Render Output
      if (pageMatches.length === 0 && sidebarMatches.length === 0) {
        resultsContainer.innerHTML = `
          <div class="modal-search-empty">
            <i class="fa fa-info-circle modal-search-empty-icon"></i>
            <p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>
            <span class="modal-search-empty-sub">Try searching by topic, section heading, or page title</span>
          </div>
        `;
        selectedIndex = -1;
        visibleItems = [];
        return;
      }

      var html = "";

      // Render Page Section
      if (pageMatches.length > 0) {
        html += `<div class="modal-search-group-title"><i class="fa fa-file-text-o"></i> ON THIS PAGE (${pageMatches.length})</div>`;
        pageMatches.forEach(function(item) {
          if (item.type === "heading") {
            html += `
              <div class="modal-search-item" data-action="scroll" data-target-id="${item.id}" role="button" tabindex="0">
                <div class="modal-search-item-left">
                  <span class="modal-search-badge-type badge-heading">${item.level}</span>
                  <div class="modal-search-item-content">
                    <div class="modal-search-item-title">${highlightMatches(item.title, query)}</div>
                  </div>
                </div>
                <i class="fa fa-level-down modal-search-item-arrow"></i>
              </div>
            `;
          } else {
            // Paragraph snippet with context
            var snippet = item.text;
            if (snippet.length > 140) {
              var matchIdx = snippet.toLowerCase().indexOf(query);
              var start = Math.max(0, matchIdx - 40);
              var end = Math.min(snippet.length, matchIdx + 80);
              snippet = (start > 0 ? "..." : "") + snippet.substring(start, end) + (end < snippet.length ? "..." : "");
            }
            html += `
              <div class="modal-search-item" data-action="scroll" data-target-id="${item.id}" role="button" tabindex="0">
                <div class="modal-search-item-left">
                  <span class="modal-search-badge-type badge-snippet">TEXT</span>
                  <div class="modal-search-item-content">
                    ${item.context ? `<div class="modal-search-item-context">${escapeHtml(item.context)}</div>` : ''}
                    <div class="modal-search-item-snippet">${highlightMatches(snippet, query)}</div>
                  </div>
                </div>
                <i class="fa fa-level-down modal-search-item-arrow"></i>
              </div>
            `;
          }
        });
      }

      // Render Sidebar Section
      if (sidebarMatches.length > 0) {
        html += `<div class="modal-search-group-title"><i class="fa fa-bookmark-o"></i> SIDEBAR / ALL PAGES (${sidebarMatches.length})</div>`;
        sidebarMatches.forEach(function(item) {
          html += `
            <a class="modal-search-item" data-action="navigate" href="${escapeHtml(item.url)}">
              <div class="modal-search-item-left">
                <span class="modal-search-badge-type badge-page">PAGE</span>
                <div class="modal-search-item-content">
                  <div class="modal-search-item-context">${escapeHtml(item.category)}</div>
                  <div class="modal-search-item-title">${highlightMatches(item.title, query)}</div>
                </div>
              </div>
              <i class="fa fa-arrow-right modal-search-item-arrow"></i>
            </a>
          `;
        });
      }

      resultsContainer.innerHTML = html;

      // Update interactive elements
      visibleItems = Array.from(resultsContainer.querySelectorAll(".modal-search-item"));
      if (visibleItems.length > 0) {
        updateSelection(0);
      }
    }

    input.removeEventListener("input", handleSearch);
    input.addEventListener("input", handleSearch);

    // Keyboard navigation in search input
    input.addEventListener("keydown", function(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        updateSelection(selectedIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        updateSelection(selectedIndex - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < visibleItems.length) {
          var item = visibleItems[selectedIndex];
          triggerItemAction(item);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeSearch();
      }
    });

    function triggerItemAction(item) {
      if (!item) return;
      var action = item.getAttribute("data-action");
      if (action === "scroll") {
        var targetId = item.getAttribute("data-target-id");
        closeSearch();
        if (targetId) {
          var targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            pulseHighlight(targetEl);
          }
        }
      } else if (action === "navigate") {
        closeSearch();
        var href = item.getAttribute("href");
        if (href) {
          window.location.href = href;
        }
      }
    }

    // Click handler on results container
    resultsContainer.addEventListener("click", function(e) {
      var item = e.target.closest(".modal-search-item");
      if (item) {
        var action = item.getAttribute("data-action");
        if (action === "scroll") {
          e.preventDefault();
          triggerItemAction(item);
        } else if (action === "navigate") {
          closeSearch();
          // regular link navigation will follow href
        }
      }
    });
  }

  // Export to window
  window.NotesSearch = {
    initialize: initializeSearch,
    reindex: indexCurrentPage
  };
})(window);
