(function () {
  "use strict";
  var state = { recipes: [], selectedId: "", query: "" };
  var list = document.getElementById("recipe-list");
  var library = document.getElementById("library");
  var status = document.getElementById("status");
  var search = document.getElementById("search");
  var count = document.getElementById("recipe-count");
  var empty = document.getElementById("empty-state");
  var title = document.getElementById("recipe-title");
  var content = document.getElementById("recipe-content");
  var updated = document.getElementById("recipe-updated");
  var back = document.getElementById("back-button");

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function filteredRecipes() {
    var needle = state.query.trim().toLocaleLowerCase("nl");
    if (!needle) return state.recipes;
    return state.recipes.filter(function (recipe) {
      return (recipe.title + "\n" + recipe.text).toLocaleLowerCase("nl").indexOf(needle) !== -1;
    });
  }

  function appendList(lines, ordered) {
    if (!lines.length) return;
    var node = el(ordered ? "ol" : "ul");
    lines.forEach(function (line) { node.appendChild(el("li", "", line)); });
    content.appendChild(node);
  }

  function renderDocument(recipe) {
    title.textContent = recipe.title;
    content.textContent = "";
    var lines = (recipe.text || "").replace(/\r/g, "").split("\n");
    if (lines.length && lines[0].trim().toLocaleLowerCase("nl") === recipe.title.trim().toLocaleLowerCase("nl")) lines.shift();
    var bullets = [];
    var numbers = [];
    function flush() { appendList(bullets, false); appendList(numbers, true); bullets = []; numbers = []; }

    lines.forEach(function (rawLine) {
      var line = rawLine.trim();
      if (!line) { flush(); return; }
      if (/^(Ingrediënten|Bereiding|Opmerkingen):$/i.test(line)) {
        flush(); content.appendChild(el("h2", "", line.replace(/:$/, ""))); return;
      }
      if (/^-\s+/.test(line)) { if (numbers.length) flush(); bullets.push(line.replace(/^-\s+/, "")); return; }
      if (/^\d+[.)]\s+/.test(line)) { if (bullets.length) flush(); numbers.push(line.replace(/^\d+[.)]\s+/, "")); return; }
      flush();
      if (/^Bron:\s*/i.test(line)) {
        var source = el("p", "source");
        source.appendChild(document.createTextNode("Bron: "));
        var url = line.replace(/^Bron:\s*/i, "");
        if (/^https?:\/\//i.test(url)) {
          var link = el("a", "", url); link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer"; source.appendChild(link);
        } else source.appendChild(document.createTextNode(url));
        content.appendChild(source);
      } else content.appendChild(el("p", "", line));
    });
    flush();
    var date = recipe.updated ? new Date(recipe.updated) : null;
    updated.textContent = date && !isNaN(date.getTime()) ? "Laatst gewijzigd op " + new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(date) : "";
  }

  function selectRecipe(id, pushHash) {
    var recipe = state.recipes.find(function (item) { return item.id === id; });
    if (!recipe) return;
    state.selectedId = id; renderDocument(recipe); renderList(); library.classList.add("show-detail");
    if (pushHash) history.replaceState(null, "", "#" + encodeURIComponent(id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderList() {
    var recipes = filteredRecipes();
    list.textContent = ""; empty.hidden = recipes.length !== 0;
    count.textContent = recipes.length + (recipes.length === 1 ? " gerecht" : " gerechten");
    recipes.forEach(function (recipe) {
      var button = el("button", "", recipe.title); button.type = "button";
      button.setAttribute("aria-current", recipe.id === state.selectedId ? "true" : "false");
      button.addEventListener("click", function () { selectRecipe(recipe.id, true); });
      var item = el("li"); item.appendChild(button); list.appendChild(item);
    });
  }

  function showRecipes(data) {
    if (!data || !Array.isArray(data.recipes)) { showError("De gerechten konden niet worden gelezen."); return; }
    state.recipes = data.recipes.slice().sort(function (a, b) { return a.title.localeCompare(b.title, "nl", { sensitivity: "base" }); });
    status.hidden = true; library.hidden = false; renderList();
    if (!state.recipes.length) { title.textContent = "Nog geen gerechten"; content.textContent = "De map Gerechten bevat momenteel geen Google Docs-documenten."; return; }
    var hashId = decodeURIComponent(location.hash.slice(1));
    selectRecipe(state.recipes.some(function (item) { return item.id === hashId; }) ? hashId : state.recipes[0].id, false);
  }

  function showError(message) { status.textContent = message; status.classList.add("is-error"); status.hidden = false; library.hidden = true; }

  function loadRecipes() {
    var endpoint = window.RECEPTEN_API_URL || "";
    if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(endpoint)) { showError("De Google Drive-koppeling moet nog één keer worden ingesteld."); return; }
    var callback = "__receiveRecipes";
    var request = document.createElement("script");
    // De web-app is openbaar. Zonder inlogcookies voorkomt dit dat Google bij
    // gebruikers met meerdere accounts naar een ongeldige /macros/u/... URL stuurt.
    request.crossOrigin = "anonymous";
    var timeout = window.setTimeout(function () { request.remove(); showError("Google Drive reageert niet. Probeer de pagina later opnieuw te laden."); }, 15000);
    window[callback] = function (data) {
      window.clearTimeout(timeout); request.remove(); delete window[callback];
      if (data.error) { showError("De gerechten konden niet worden geladen: " + data.error); return; }
      showRecipes(data);
    };
    request.onerror = function () { window.clearTimeout(timeout); showError("De verbinding met Google Drive is mislukt."); };
    request.src = endpoint + "?callback=" + callback + "&t=" + Date.now(); document.head.appendChild(request);
  }

  search.addEventListener("input", function () { state.query = search.value; renderList(); });
  back.addEventListener("click", function () { library.classList.remove("show-detail"); search.focus(); });
  loadRecipes();
})();
