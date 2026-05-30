(function(window) {
  // Helper to format absolute dates
  function formatAbsoluteDate(date, includeTime) {
    var yyyy = date.getFullYear();
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var dd = String(date.getDate()).padStart(2, '0');
    if (includeTime) {
      var hh = String(date.getHours()).padStart(2, '0');
      var min = String(date.getMinutes()).padStart(2, '0');
      return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min;
    }
    return yyyy + "-" + mm + "-" + dd;
  }

  // Helper to calculate relative time
  function getRelativeTimeString(date) {
    var now = new Date();
    var diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "just now";

    var diffSeconds = Math.floor(diffMs / 1000);
    var diffMinutes = Math.floor(diffSeconds / 60);
    var diffHours = Math.floor(diffMinutes / 60);
    var diffDays = Math.floor(diffHours / 24);
    var diffWeeks = Math.floor(diffDays / 7);
    var diffMonths = Math.floor(diffDays / 30);
    var diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) {
      return "just now";
    } else if (diffMinutes < 60) {
      return diffMinutes === 1 ? "1 minute ago" : diffMinutes + " minutes ago";
    } else if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : diffHours + " hours ago";
    } else if (diffDays < 7) {
      if (diffDays === 0) return "today";
      if (diffDays === 1) return "yesterday";
      return diffDays + " days ago";
    } else if (diffWeeks < 4) {
      return diffWeeks === 1 ? "1 week ago" : diffWeeks + " weeks ago";
    } else if (diffMonths < 12) {
      return diffMonths === 1 ? "1 month ago" : diffMonths + " months ago";
    } else {
      return diffYears === 1 ? "1 year ago" : diffYears + " years ago";
    }
  }

  function initializeDates() {
    var clickables = document.querySelectorAll(".page-meta-clickable");
    clickables.forEach(function (el) {
      if (el.hasAttribute("data-dates-initialized")) return; // Skip if already done

      var rawVal = el.getAttribute("data-date") || el.getAttribute("data-mtime");
      if (!rawVal) return;

      var date = new Date(rawVal);
      if (isNaN(date.getTime())) return;

      var isMtime = el.hasAttribute("data-mtime");
      var prefix = isMtime ? "LAST UPDATED // " : "PUBLISHED // ";

      var relativeStr = prefix + getRelativeTimeString(date);
      var absoluteStr = prefix + formatAbsoluteDate(date, isMtime);

      // Render relative by default
      el.textContent = relativeStr;
      el.title = "Click to show raw timestamp";
      el.setAttribute("data-dates-initialized", "true");

      // Toggle state on click
      var showingRelative = true;
      el.addEventListener("click", function () {
        if (showingRelative) {
          el.textContent = absoluteStr;
          el.title = "Click to show relative time";
        } else {
          el.textContent = relativeStr;
          el.title = "Click to show raw timestamp";
        }
        showingRelative = !showingRelative;
      });
    });
  }

  // Export to window
  window.NotesDates = {
    initialize: initializeDates
  };
})(window);
