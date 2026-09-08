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

## Foto's en HTTPS

De bot slaat gerechtfoto's op in Drive en koppelt ze via de documentbeschrijving
`receptenbot-foto:BESTAND_ID`. Apps Script geeft de foto-URL terug; de site toont
een kleine foto in de lijst en een grote foto bij het recept. Recepten zonder foto
en niet-beschikbare foto's blijven leesbaar.

Bij een update van `Code.gs`: open de bestaande Apps Script-implementatie via
**Implementeren → Implementaties beheren → Bewerken → Nieuwe versie → Implementeren**.
Behoud dezelfde /exec-URL en bestaande toegangsinstellingen.

GitHub Pages moet onder **Settings → Pages → Enforce HTTPS** ingeschakeld staan.
Het domein is `recepten.michielmeilink.com`, met CNAME naar `michielmeilink.github.io`.
