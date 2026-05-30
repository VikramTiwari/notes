(function(window) {
  function initializeWebGLPreloader() {
    var embeds = document.querySelectorAll(".demo-embed-container");
    embeds.forEach(function (container) {
      if (container.hasAttribute("data-embed-initialized")) return;

      var src = container.getAttribute("data-src");
      var label = container.getAttribute("data-label") || "ACTIVE INTERACTIVE DEMO";
      if (!src) return;

      container.innerHTML = "";

      // Create play overlay
      var overlay = document.createElement("div");
      overlay.className = "demo-embed-play-overlay";

      // Build the dual-button panel (Launch is primary, Play is secondary)
      overlay.innerHTML = `
            <div class="demo-embed-overlay-content">
              <div class="demo-embed-btn-group">
                <a href="${src}" target="_blank" rel="noopener" class="demo-embed-btn primary-btn">
                  <i class="fa fa-external-link"></i> Launch in New Tab
                </a>
              </div>
              <div class="demo-embed-play-label">[ ${label} ]</div>
            </div>
          `;
      container.appendChild(overlay);

      var isLoaded = false;
      var isActivated = false;
      var iframe = null;

      // Helper to load the iframe silently in the background
      function loadIframeSilently() {
        if (iframe) return;

        iframe = document.createElement("iframe");
        iframe.className = "demo-embed-iframe";
        iframe.src = src;
        iframe.style.position = "absolute";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.zIndex = "1";
        iframe.style.opacity = "0";
        iframe.style.pointerEvents = "none"; // Disable interaction while overlay is up
        iframe.style.transition = "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        iframe.setAttribute("allow", "fullscreen");
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute("importance", "low");
        iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms");
        iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");

        // Append iframe behind the overlay
        container.insertBefore(iframe, overlay);

        iframe.onload = function () {
          isLoaded = true;
          if (!isActivated) {
            // Fade in the iframe partially in the background
            iframe.style.opacity = "0.75";
            // Make the overlay background semi-transparent so the live 3D canvas is visible
            overlay.classList.add("semi-transparent");
          }
        };
      }

      // Function to fully activate the inline play experience
      function activateIframe() {
        if (isActivated) return;
        isActivated = true;

        // Clear any idle timer
        if (idleTimer) clearTimeout(idleTimer);

        // If iframe isn't created yet, create and mount it
        if (!iframe) {
          loadIframeSilently();
        }

        // Fade out the overlay controls smoothly
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";

        // Make iframe fully opaque and interactive
        if (iframe) {
          iframe.style.opacity = "1";
          iframe.style.pointerEvents = "auto";
        }

        setTimeout(function () {
          overlay.remove();
        }, 400);

        container.style.cursor = "default";
      }

      // Bind interactions to the buttons
      var launchBtn = overlay.querySelector(".primary-btn");
      var playBtn = overlay.querySelector(".secondary-btn");

      if (launchBtn) {
        launchBtn.addEventListener("click", function (e) {
          e.stopPropagation(); // Only open in new tab, do not load here
        });
      }

      if (playBtn) {
        playBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          activateIframe();
        });
      }

      // Fallback: clicking the general backdrop area also starts inline play
      overlay.addEventListener("click", function (e) {
        activateIframe();
      });

      // --- ⏱️ Smart Idle Timer for Background Pre-loading ---
      var idleTimer = null;
      function startIdleTimer() {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
          if (!isActivated) {
            loadIframeSilently();
          }
        }, 4000); // 4 seconds of idle time
      }

      // Reset idle timer on page interactions to conserve thread capacity while actively reading
      function resetIdleTimer() {
        if (!isActivated && !iframe) {
          startIdleTimer();
        }
      }

      window.addEventListener("scroll", resetIdleTimer, { passive: true });
      window.addEventListener("mousemove", resetIdleTimer, { passive: true });
      window.addEventListener("keydown", resetIdleTimer, { passive: true });

      // Start the initial idle timer
      startIdleTimer();

      container.setAttribute("data-embed-initialized", "true");
    });
  }

  // Export to window
  window.NotesEmbeds = {
    initialize: initializeWebGLPreloader
  };
})(window);
