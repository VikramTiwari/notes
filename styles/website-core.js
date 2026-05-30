document.addEventListener("DOMContentLoaded", function () {
  function initializePage() {
    // 1. Copy Buttons for Standard Code Blocks
    var preBlocks = document.querySelectorAll(".markdown-section pre");
    preBlocks.forEach(function (pre) {
      if (pre.querySelector("code.lang-mermaid")) return; // Skip mermaid blocks
      if (pre.querySelector(".copy-code-btn")) return; // Skip if already added

      var copyBtn = document.createElement("button");
      copyBtn.className = "copy-code-btn";
      copyBtn.innerHTML = "COPY";

      copyBtn.addEventListener("click", function () {
        var code = pre.querySelector("code");
        var text = code ? code.innerText : pre.innerText;

        navigator.clipboard.writeText(text).then(function () {
          copyBtn.innerHTML = "COPIED!";
          copyBtn.classList.add("copied");
          setTimeout(function () {
            copyBtn.innerHTML = "COPY";
            copyBtn.classList.remove("copied");
          }, 2000);
        });
      });

      pre.appendChild(copyBtn);
    });

    // 2. Inject Social Icons above "Published with HonKit"
    var dividerLi = document.querySelector(".book-summary ul.summary li.divider");
    var gitbookLink = document.querySelector(".book-summary ul.summary li a.gitbook-link");
    if (gitbookLink && !document.getElementById("sidebar-social-container")) {
      var parentLi = gitbookLink.parentNode;
      var summaryUl = parentLi.parentNode;
      var targetLi = dividerLi || parentLi; // Fallback if no divider is found

      var socialLi = document.createElement("li");
      socialLi.id = "sidebar-social-container";
      socialLi.innerHTML = `
            <div class="sidebar-social-icons">
              <a href="https://linkedin.com/in/VikramTiwari" target="_blank" rel="noopener" title="My LinkedIn">
                <i class="fa fa-linkedin"></i>
              </a>
              <a href="https://github.com/vikramtiwari" target="_blank" rel="noopener" title="My GitHub">
                <i class="fa fa-github"></i>
              </a>
              <a href="https://twitter.com/vikram_tiwari" target="_blank" rel="noopener" title="My X (Twitter)">
                <i class="fa fa-twitter"></i>
              </a>
            </div>
          `;
      summaryUl.insertBefore(socialLi, targetLi);
    }

    // 3. Persist Sidebar Scroll Position Across PJAX Transitions
    var sidebarNav = document.querySelector(".book-summary nav");
    if (sidebarNav) {
      // Restore scroll position
      var savedScrollTop = sessionStorage.getItem("sidebarScrollTop");
      if (savedScrollTop !== null) {
        var targetScroll = parseFloat(savedScrollTop);
        sidebarNav.scrollTop = targetScroll;
        // Re-check scroll on the next animation frame to prevent timing layout resets
        requestAnimationFrame(function () {
          if (sidebarNav) sidebarNav.scrollTop = targetScroll;
        });
      }

      // Save scroll position on scroll with a short debounce
      var scrollTimeout;
      sidebarNav.addEventListener("scroll", function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
          sessionStorage.setItem("sidebarScrollTop", sidebarNav.scrollTop);
        }, 50);
      });
    }

    // 4. Trigger modular subsystem initializers if registered
    if (window.NotesDates && typeof window.NotesDates.initialize === "function") {
      window.NotesDates.initialize();
    }
    if (window.NotesMermaid && typeof window.NotesMermaid.initialize === "function") {
      window.NotesMermaid.initialize();
    }
    if (window.NotesSearch && typeof window.NotesSearch.initialize === "function") {
      window.NotesSearch.initialize();
    }
    if (window.NotesEmbeds && typeof window.NotesEmbeds.initialize === "function") {
      window.NotesEmbeds.initialize();
    }
  }

  // Run once on DOM load
  initializePage();

  // Register callback in GitBook pushState event bus to re-run on PJAX navigation
  var gitbook = window.gitbook || [];
  gitbook.push(function () {
    gitbook.events.bind("page.change", function () {
      initializePage();
    });
  });
});
