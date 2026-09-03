# Mijn gerechten

Openbare receptenbibliotheek die de Google Docs-documenten uit de Drive-map `Gerechten` toont.

## Eenmalige Google-koppeling

1. Open <https://script.google.com/> en maak een nieuw project `Gerechten website`.
2. Vervang `Code.gs` door [`apps-script/Code.gs`](apps-script/Code.gs).
3. Open de projectinstellingen, toon `appsscript.json` en vervang het manifest door [`apps-script/appsscript.json`](apps-script/appsscript.json).
4. Kies **Implementeren → Nieuwe implementatie → Web-app**.
5. Kies **Uitvoeren als: Ikzelf** en **Wie heeft toegang: Iedereen**.
6. Geef toestemming en kopieer de URL die eindigt op `/exec`.
7. Plak die URL in [`config.js`](config.js) bij `window.RECEPTEN_API_URL`.

De map wordt bij elke paginalaad live gelezen. Nieuwe documenten verschijnen automatisch; verwijderde documenten verdwijnen automatisch.
