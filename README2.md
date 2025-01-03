## About

Chrome Extension with abilities to encrypt and decrypt text.

## Build

Clone the repository and run `npm install` and then `npm run build.win` / `npm run build.linux` in the project's root directory. 

***Included npm scripts:***

1. **clean.win** / **clean.linux**: Delete the `dist` directory if it exists
2. **compile**: Runs the `build.cjs` file with node, which transpiles the typescript into javascript and bundles it all into `dist/content-script/content.js`.
3. **copy-assets.win** / **copy-assets.linux**: Copies the remaining extension files, like `manifest.json`, the popup and icons to the `dist` directory.
4. **build.win** / **build.linux**: Runs the above three scripts in this order and then zips the `dist` directory into a `dist.zip` file.

These can be run individually with `npm run <script>`.

Files excluded in the copying to the `dist` directory can be adjusted in `exclude-files.txt`.

## Usage

- Build the extension or download zip on https://github.com/eneasinfanger/M114-Extension/releases/tag/Latest and extract it.
- Load it into your chrome-browser by visiting [`chrome://extensions/`](chrome://extensions/), toggling the "Developer mode" switch in the upper right corner, click the now visible "Load unpacked" button in the top left corner and select the `dist` folder.
- Select any text on any (non `chrome://` site) and a menu with en-/decryption actions should appear.
- The extension can be de-/activated by clicking the icon in the top right corner of the browser or pressing `CTRL`+`B` (can be changed on [`chrome://extensions/shortcuts`](chrome://extensions/shortcuts)).