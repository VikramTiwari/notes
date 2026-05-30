(function(window) {
  function initializeMermaidEngine() {
    var mermaidBlocks = document.querySelectorAll("pre code.lang-mermaid");
    var hasMermaid = mermaidBlocks.length > 0 || document.querySelectorAll(".mermaid").length > 0;

    if (mermaidBlocks.length > 0) {
      mermaidBlocks.forEach(function (code) {
        var pre = code.parentNode;
        var div = document.createElement("div");
        div.className = "mermaid";
        div.textContent = code.textContent;
        pre.parentNode.replaceChild(div, pre);
      });
    }

    if (hasMermaid) {
      if (typeof mermaid === "undefined") {
        var scriptId = "mermaid-lazy-script";
        var existingScript = document.getElementById(scriptId);
        if (!existingScript) {
          var script = document.createElement("script");
          script.id = scriptId;
          script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
          script.async = true;
          script.onload = function () {
            initializeMermaid();
          };
          document.head.appendChild(script);
        }
      } else {
        initializeMermaid();
      }
    }

    function initializeMermaid() {
      if (typeof mermaid !== "undefined") {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose'
        });
        mermaid.init(undefined, document.querySelectorAll(".mermaid"));
      }
    }
  }

  // Export to window
  window.NotesMermaid = {
    initialize: initializeMermaidEngine
  };
})(window);
