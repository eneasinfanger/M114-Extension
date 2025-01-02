import { Encryptor } from './encryption-decryption/encryptor.js';
import { REVERSE_ENCRYPTOR } from './encryption-decryption/reverse.js';
import { CAESAR_ENCRYPTOR } from './encryption-decryption/substitution/caesar.js';
import { KEYWORD_ENCRYPTOR } from './encryption-decryption/substitution/keyword.js';
import { FENCE_ENCRYPTOR } from './encryption-decryption/transposition/rail-fence.js';
import { MATRIX_ENCRYPTOR } from './encryption-decryption/transposition/matrix.js';
import { POLYALPHABETIC_ENCRYPTOR } from './encryption-decryption/substitution/polyalphabetic.js';

let extensionEnabled: boolean = true;

isExtensionEnabled();

function isExtensionEnabled(): Promise<boolean> {
    return chrome.storage.local.get('enabled')
        .then(value => value.enabled || true, _ => true)
        .then(enabled => extensionEnabled = enabled);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action !== 'toggleEnabled') {
        throw new Error(`unexpected enabled action: ${ request.action }`);
    }

    extensionEnabled = !extensionEnabled;
    chrome.storage.local.set({ 'enabled': extensionEnabled });

    if (!extensionEnabled) {
        removeCustomMenu();
        removeAnchor();
    }

    sendResponse(extensionEnabled);
});

let selectionAnchor: HTMLSpanElement | null = null;
let placedMenu: HTMLDivElement | null = null;

document.addEventListener('mouseup', (event) => {
    if (!extensionEnabled) {
        return;
    }

    if (placedMenu && placedMenu.contains(event.target as Node | null)) { // clicked in menu
        return;
    }

    const selection = window.getSelection();

    if (placedMenu && placedMenu.contains(selection?.anchorNode || null)) { // selection in menu
        return;
    }

    const selectionText = selection?.toString().trim();

    if (placedMenu || !selection || !selectionText || !selection.rangeCount) { // clicked outside of existing menu or no selection / empty selection was made
        removeCustomMenu();
        removeAnchor();
        return;
    }

    const range = selection.getRangeAt(0);

    selectionAnchor = document.createElement('span');
    selectionAnchor.style.display = 'inline-block';
    selectionAnchor.style.width = '0';
    selectionAnchor.style.height = '0';
    selectionAnchor.style.visibility = 'hidden';

    const rangeCopy = range.cloneRange();
    rangeCopy.collapse();
    rangeCopy.insertNode(selectionAnchor);

    const bounds = range.getBoundingClientRect();

    createCustomMenu(bounds.x, bounds.y + 50, selectionText);
    updateMenuPosition();
});

document.addEventListener('mousedown', (event) => {
    if (!extensionEnabled) {
        return;
    }

    const selection = window.getSelection();
    if (selection && selection.rangeCount && isClickWithinRect(event, selection?.getRangeAt(0)
        .getBoundingClientRect()!)) { // clicked within current selection
        return;
    }
    if (placedMenu && !placedMenu.contains(event.target as Node | null)) {
        removeCustomMenu();
        removeAnchor();
    }
});

function isClickWithinRect(event: MouseEvent, rect: DOMRect) {
    const { clientX, clientY } = event;
    const { left, top, right, bottom } = rect;

    return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;
}

document.addEventListener('scroll', updateMenuPosition, true);

function updateMenuPosition() {
    if (!extensionEnabled) {
        return;
    }

    if (!selectionAnchor || !placedMenu) {
        return;
    }

    const rect = selectionAnchor.getBoundingClientRect();
    placedMenu.style.top = window.scrollY + rect.top + 10 /*- placedMenu.offsetHeight + 250*/ + 'px';
    placedMenu.style.left = window.scrollX + rect.left + 'px';
}

const encryptors: Encryptor<any>[] = [
    REVERSE_ENCRYPTOR,
    CAESAR_ENCRYPTOR,
    KEYWORD_ENCRYPTOR,
    FENCE_ENCRYPTOR,
    MATRIX_ENCRYPTOR,
    POLYALPHABETIC_ENCRYPTOR
];

function createCustomMenu(x: number, y: number, text: string) {
    removeCustomMenu();

    placedMenu = createMenuElement(x, y);
    placedMenu.style.maxWidth = '550px';

    const title = document.createElement('h4');
    title.textContent = 'Entschlüsseln / Verschlüsseln';
    title.style.marginBottom = '10px';
    placedMenu.appendChild(title);

    const message = document.createElement('div');
    message.innerHTML = createQuoteHtml(text.length <= 60 ? text : text.slice(0, 60) + '...') + '<br>Wähle eine Methode aus:';
    message.style.marginBottom = '10px';
    placedMenu.appendChild(message);

    for (const encryptor of encryptors) {
        const name = encryptor.name.join('/');
        placedMenu.appendChild(
            createButton(name, (e) => {
                e.stopPropagation(); // Prevent propagation to avoid reopening the menu
                createActionMenu(x, y, name, text, encryptor);
            })
        );
    }

    document.body.appendChild(placedMenu);
}

function removeCustomMenu() {
    placedMenu?.remove();
    placedMenu = null;
}

function removeAnchor() {
    selectionAnchor?.remove();
    selectionAnchor = null;
}

function createMenuElement(x: number, y: number) {
    const menu = document.createElement('div');
    menu.id = 'custom-menu';

    Object.assign(menu.style, {
        position: 'absolute', // Absolute positioning for manual scrolling updates
        top: `${ y + window.scrollY }px`,
        left: `${ x + window.scrollX }px`,
        transform: 'translateX(-50%)',
        backgroundColor: 'black',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        zIndex: '1000',
        display: 'inline-block',
        pointerEvents: 'auto', // Allow interactions
        textAlign: 'center'
    });

    menu.dataset.initialX = String(x);
    menu.dataset.initialY = String(y);

    return menu;
}

function createActionMenu(x: number, y: number, name: string, text: string, encryptor: Encryptor<any>) {
    removeCustomMenu(); // Remove existing menu before creating the new one

    placedMenu = createMenuElement(x, y);
    placedMenu.style.width = '250px';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'input text';
    textInput.value = text;
    textInput.style.padding = '5px';
    textInput.style.fontSize = '14px';
    textInput.style.width = 'calc(100% - 10px)';
    textInput.style.color = 'black';
    placedMenu.appendChild(textInput);

    let keyInput: HTMLInputElement | undefined;

    if (encryptor.key.type !== 'none') {
        keyInput = document.createElement('input');
        if (encryptor.key.type === 'string') {
            keyInput.type = 'text';
        } else if (encryptor.key.type === 'integer') {
            keyInput.type = 'number';
            keyInput.step = '1';
            // TODO: not enable manual input non-integer
        }
        // keyInput.placeholder = 'key (optional)';
        keyInput.style.padding = '5px';
        keyInput.style.fontSize = '14px';
        keyInput.style.width = 'calc(100% - 10px)';
        keyInput.style.color = 'black';
        placedMenu.appendChild(keyInput);
    }

    let encryptCheckbox: HTMLInputElement = createCheckbox('Verschlüsseln', 'encrypt', true, placedMenu, () => {
        decryptCheckbox.checked = !encryptCheckbox.checked;
        checkKeyPlaceholder();
    });
    let decryptCheckbox: HTMLInputElement = createCheckbox('Entschlüsseln', 'decrypt', false, placedMenu, () => {
        encryptCheckbox.checked = !decryptCheckbox.checked;
        checkKeyPlaceholder();
    });

    checkKeyPlaceholder();

    function checkKeyPlaceholder() {
        if (keyInput) {
            if ((encryptCheckbox.checked && encryptor.key.requiredForEncryption) || (decryptCheckbox.checked && encryptor.key.requiredForDecryption)) {
                keyInput.placeholder = 'Schlüssel';
            } else {
                keyInput.placeholder = 'Schlüssel (Optional)';
            }
        }
    }

    const resultTitle = document.createElement('p');
    const results = document.createElement('ul');

    function setResultTitle(text: string, error: boolean = false) {
        resultTitle.textContent = text;
        resultTitle.style.color = error ? 'red' : 'white';
        resultTitle.style.fontWeight = error ? 'bold' : 'normal';
    }

    function addResult(text: string) {
        const li = document.createElement('li');
        li.innerHTML = text;
        results.appendChild(li);
    }

    placedMenu.appendChild(
        createButton('ok', () => {
            const newText = textInput.value.trim();
            const newKey = keyInput?.value.trim();

            const encrypt = encryptCheckbox.checked;
            const decrypt = decryptCheckbox.checked;

            results.replaceChildren(); // clear results
            if (!newText) {
                setResultTitle('Der Text darf nicht leer sein!', true);
            } else if (encrypt && encryptor.key.requiredForEncryption && !newKey) {
                setResultTitle('Es muss für diese Methode zum verschlüsseln ein Schlüssel eingegeben werden!', true);
            } else if (decrypt && encryptor.key.requiredForDecryption && !newKey) {
                setResultTitle('Es muss für diese Methode zum entschlüsseln ein Schlüssel eingegeben werden!', true);
            } else {
                let parsedKey = encryptor.key.type === 'none'
                    ? undefined
                    : (encryptor.key.parseNumber ? Number(newKey) : newKey);
                const encryptResult: string | string[] | Map<string | number, string> = encrypt ? encryptor.encrypt(newText, parsedKey) : encryptor.decrypt(newText, parsedKey);
                setResultTitle('Resultat(e):');
                if (typeof encryptResult === 'string') {
                    addResult(createQuoteHtml(encryptResult));
                } else if (encryptResult instanceof Array) {
                    encryptResult.map(createQuoteHtml).forEach(addResult);
                } else if (encryptResult instanceof Map) {
                    encryptResult.forEach((value, key) => {
                        addResult(`<span style="float: left;">${ typeof key === 'number' ? key : '"' + key + '"' }:</span> ${ createQuoteHtml(value) }`);
                    });
                } else {
                    console.error(`Unexpected ${ encrypt ? 'encryption' : 'decryption' } result type:`, encryptResult);
                }
            }
        })
    );

    placedMenu.appendChild(resultTitle);
    placedMenu.appendChild(results);

    document.body.appendChild(placedMenu);
}

function createCheckbox(text: string, identifier: string, checked: boolean, parent: HTMLElement, stateChanged: () => any): HTMLInputElement {
    const div = document.createElement('div');
    div.style.padding = '2px';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = identifier;
    input.defaultChecked = checked;

    const label = document.createElement('label');
    label.textContent = text;
    label.htmlFor = identifier;

    div.appendChild(input);
    div.appendChild(label);
    parent.appendChild(div);

    input.addEventListener('change', stateChanged);
    return input;
}

function createButton(label: string, callback: (event: MouseEvent) => any) {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.color = 'black';
    button.style.backgroundColor = 'white';
    button.style.borderRadius = '15px';
    button.style.margin = '5px';
    button.style.padding = '5px 10px';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    button.onclick = callback;
    return button;
}

function createQuoteHtml(text: string): string {
    return '"<i style="color:darkgray">' + text + '</i>"';
}