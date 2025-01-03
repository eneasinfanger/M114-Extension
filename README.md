## Über

Chrome-Erweiterung mit der Möglichkeit, Text zu verschlüsseln und zu entschlüsseln.

## Erstellen

Klonen Sie das Repository und führen Sie `npm install` und dann `npm run build.win` / `npm run build.linux` im Stammverzeichnis des Projekts aus.

***Enthaltene npm-Skripte:***

1. **clean.win** / **clean.linux**: Löschen Sie das Verzeichnis `dist`, falls es vorhanden ist.
2. **compile**: Führt die Datei `build.cjs` mit Node aus, wodurch das Typescript in JavaScript transpiliert und alles in `dist/content-script/content.js` gebündelt wird.
3. **copy-assets.win** / **copy-assets.linux**: Kopiert die verbleibenden Erweiterungsdateien wie `manifest.json`, das Popup und die Symbole in das Verzeichnis `dist`.
4. **build.win** / **build.linux**: Führt die drei oben genannten Skripte in dieser Reihenfolge aus.

Diese können einzeln mit `npm run <script>` ausgeführt werden.

Dateien, die beim Kopieren in das `dist`-Verzeichnis ausgeschlossen sind, können in `exclude-files.txt` angepasst werden.

## Verwendung

- Erstellen Sie die Erweiterung oder laden Sie die Zip-Datei unter https://github.com/eneasinfanger/M114-Extension/releases/tag/Latest herunter und extrahieren Sie sie.
- Laden Sie sie in Ihren Chrome-Browser, indem Sie [`chrome://extensions/`](chrome://extensions/) aufrufen, den Schalter „Entwicklermodus“ in der oberen rechten Ecke umschalten, auf die jetzt sichtbare Schaltfläche „Entpackt laden“ in der oberen linken Ecke klicken und den Ordner `dist` auswählen.
- Wählen Sie einen beliebigen Text auf einer beliebigen (nicht `chrome://`-Seite) aus. Ein Menü mit Aktionen zum Ver-/Entschlüsseln sollte angezeigt werden.
- Die Erweiterung kann durch Klicken auf das Symbol in der oberen rechten Ecke des Browsers oder durch Drücken von `STRG`+`B` de-/aktiviert werden (kann unter [`chrome://extensions/shortcuts`](chrome://extensions/shortcuts) geändert werden).