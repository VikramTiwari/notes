(function(window) {
  function initializeSearchHUD() {
    var headerTitleLink = document.querySelector(".book-header h1 a");
    var headerSearch = document.querySelector(".header-search-bar");
    var headerH1 = document.querySelector(".book-header h1");
    var headerSearchInput = document.getElementById("header-search-input");
    var headerSearchClose = document.querySelector(".header-search-close");

    if (headerTitleLink && headerSearch && headerH1 && headerSearchInput && headerSearchClose) {
      if (headerTitleLink.hasAttribute("data-search-initialized")) return; // Skip if already done
      headerTitleLink.setAttribute("data-search-initialized", "true");

      // Intercept click on the header title
      headerTitleLink.addEventListener("click", function (e) {
        e.preventDefault(); // Stop redirection to home
        e.stopPropagation();

        // Hide title only, keeping dynamic published/updated metadata fully visible
        headerH1.style.setProperty("display", "none", "important");

        // Show search bar and focus input
        headerSearch.style.setProperty("display", "flex", "important");
        headerSearchInput.focus();
      });

      // Close search on close button click
      headerSearchClose.addEventListener("click", function (e) {
        e.stopPropagation();
        closeHeaderSearch();
      });

      // Close search on Escape key press
      headerSearchInput.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          closeHeaderSearch();
        }
      });

      // Close search on click out (blur) if the input is empty
      headerSearchInput.addEventListener("blur", function () {
        if (headerSearchInput.value.trim() === "") {
          closeHeaderSearch();
        }
      });

      // Sync typing to sidebar search input
      headerSearchInput.addEventListener("input", function () {
        var query = headerSearchInput.value;
        var sidebarInput = document.querySelector("#book-search-input input");
        if (sidebarInput) {
          sidebarInput.value = query;
          // Dispatch input events so the native search plugin handles it
          var inputEvent = new Event("input", { bubbles: true });
          var changeEvent = new Event("change", { bubbles: true });
          var keyupEvent = new KeyboardEvent("keyup", { bubbles: true, key: "Enter" });
          sidebarInput.dispatchEvent(inputEvent);
          sidebarInput.dispatchEvent(changeEvent);
          sidebarInput.dispatchEvent(keyupEvent);
        }
      });

      function closeHeaderSearch() {
        // Clear inputs
        headerSearchInput.value = "";
        var sidebarInput = document.querySelector("#book-search-input input");
        if (sidebarInput) {
          sidebarInput.value = "";
          var inputEvent = new Event("input", { bubbles: true });
          sidebarInput.dispatchEvent(inputEvent);
        }

        // Hide search bar
        headerSearch.style.setProperty("display", "none", "important");

        // Restore title by clearing custom inline displays, metadata was never hidden
        headerH1.style.display = "";
      }
    }
  }

  // Export to window
  window.NotesSearch = {
    initialize: initializeSearchHUD
  };
})(window);
