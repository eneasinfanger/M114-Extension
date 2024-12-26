## About

Chrome Extension with abilities to encrypt and decrypt text.

## Build

Clone the repository, run `npm install` and the run `npm run build`. If you are not using windows, then you have to change the scripts in `package.json`. The scripts are the following:

1. **clean**: Delete the `dist` directory if it exists
2. **compile**: Runs the `build.cjs` file with node, which transpiles the typescript into javascript and bundles it all into `dist/content-script/content.js`.
3. **copy-assets**: Copies the remaining extension files, like `manifest.json` or the popup and icons to the `dist` directory.
4. **build**: Runs the above three scripts in this order.

They can be run with `npm run <script>`.

## Usage

- Load it into your chrome-browser by visiting `chrome://extensions/`, toggling the "Developer mode" switch in the upper right corner, click the now visible "Load unpacked" button in the top left corner and select the `dist` folder.
- Select any text on any (non "chrome://" site) and a menu with en-/decryption actions should appear.