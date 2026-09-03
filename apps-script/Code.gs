const FOLDER_ID = "1w0yE_lxSmbBUTbbf9SuEKu-MTzScibVY";

function doGet(request) {
  const callback = String((request && request.parameter.callback) || "");
  if (!/^[$A-Z_a-z][$\w]*$/.test(callback)) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Ongeldige aanvraag" })).setMimeType(ContentService.MimeType.JSON);
  }
  try {
    return ContentService.createTextOutput(`${callback}(${JSON.stringify({ recipes: readRecipes() })});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  } catch (error) {
    const message = error && error.message ? error.message : "Onbekende fout";
    return ContentService.createTextOutput(`${callback}(${JSON.stringify({ error: message })});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

function readRecipes() {
  const files = DriveApp.getFolderById(FOLDER_ID).getFilesByType(MimeType.GOOGLE_DOCS);
  const recipes = [];
  while (files.hasNext()) {
    const file = files.next();
    if (file.isTrashed()) continue;
    const document = DocumentApp.openById(file.getId());
    recipes.push({ id: file.getId(), title: document.getName(), text: document.getBody().getText(), updated: file.getLastUpdated().toISOString() });
  }
  recipes.sort((a, b) => a.title.localeCompare(b.title));
  return recipes;
}
