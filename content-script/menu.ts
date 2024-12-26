import { Encryptor } from './encryption-decryption/encryptor.js';
import { REVERSE_ENCRYPTOR } from './encryption-decryption/reverse.js';
import { CAESAR_ENCRYPTOR, KEYWORD_ENCRYPTOR } from './encryption-decryption/substitution.js';
import { FENCE_ENCRYPTOR, MATRIX_ENCRYPTOR } from './encryption-decryption/transposition.js';
import { FailReasons } from './encryption-decryption/utils.js';

export function createCustomMenu(x: number, y: number, text: string) {
    removeCustomMenu();

    const menu = createMenuElement(x, y);

    const textDisplay = document.createElement('div');
    textDisplay.textContent = `Selected Text: "${ text }"`;
    textDisplay.style.marginBottom = '10px';
    menu.appendChild(textDisplay);

    const encryptors: Encryptor[] = [
        REVERSE_ENCRYPTOR,
        CAESAR_ENCRYPTOR,
        KEYWORD_ENCRYPTOR,
        FENCE_ENCRYPTOR,
        MATRIX_ENCRYPTOR
    ];
    for (const encryptor of encryptors) {
        const div = document.createElement('div');
        div.textContent = encryptor.name + (encryptor.format ? ' ' + encryptor.format : '') + ':\n';
        div.textContent += 'encrypted: ';
        try {
            div.textContent += encryptor.encrypt(text);
        } catch (fail) {
            switch (fail) {
                case FailReasons.NO_KEY_PROVIDED:
                    div.textContent += '[Key must be provided for this encryption method!]';
                    break;
                case FailReasons.NOT_IMPLEMENTED:
                    div.textContent += '[This method is currently not implemented!]';
                    break;
                default:
                    console.error('encryption failed: ', fail);
                    div.textContent += fail instanceof Error ? `${ fail.name }: ${ fail.message }` : String(fail);
            }
        }
        div.textContent += '\ndecrypted: ';
        try {
            div.textContent += encryptor.decrypt(text);
        } catch (fail) {
            switch (fail) {
                case FailReasons.NO_KEY_PROVIDED:
                    div.textContent += '[Key must be provided for this decryption method!]';
                    break;
                case FailReasons.NOT_IMPLEMENTED:
                    div.textContent += '[This method is currently not implemented!]';
                    break;
                default:
                    console.error('decryption failed: ', fail);
                    div.textContent += fail instanceof Error ? `${ fail.name }: ${ fail.message }` : String(fail);
            }
        }
        div.style.marginBottom = '10px';
        div.style.whiteSpace = 'pre-line'
        menu.appendChild(div);
    }

    for (let i = 1; i <= 4; i++) {
        const name = `Action ${ i }`;

        menu.appendChild(
            createButton(name, (e) => {
                e.stopPropagation(); // Prevent propagation to avoid reopening the menu
                createActionMenu(x, y + 50, name, text, {
                    name: [`test-${ i }`],
                    encrypt: (text: string, key?: string) => {
                        console.log(`[test-${ i }] encrypt called [text=${ text },key=${ key }]`);
                        return String(i);
                    },
                    decrypt: (encryptedText: string, key?: string) => {
                        console.log(`[test-${ i }] decrypt called [text=${ encryptedText },key=${ key }]`);
                        return String(i);
                    }
                });
            })
        );
    }

    document.body.appendChild(menu);
}

export function removeCustomMenu() {
    const existingMenu = document.getElementById('custom-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
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

function createActionMenu(x: number, y: number, name: string, text: string, encryptor: Encryptor) {
    removeCustomMenu(); // Remove existing menu before creating the new one

    const menu = createMenuElement(x, y);

    // Add greeting message
    const messageDisplay = document.createElement('div');
    messageDisplay.textContent = name;
    messageDisplay.style.marginBottom = '10px';
    menu.appendChild(messageDisplay);

    // Add input field
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'key (optional)';
    inputField.style.padding = '5px';
    inputField.style.fontSize = '14px';
    inputField.style.width = 'calc(100% - 10px)';
    menu.appendChild(inputField);

    menu.appendChild(
        createButton('submit', (e) => {

        })
    );

    document.body.appendChild(menu);
}

function createButton(label: string, callback: (event: MouseEvent) => any) {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.margin = '5px';
    button.style.padding = '5px 10px';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    button.onclick = callback;
    return button;
}