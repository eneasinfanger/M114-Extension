import { FailReasons } from './utils.js';
import { Encryptor } from './encryptor.js';

/* Rail Fence Cipher */

export const FENCE_ENCRYPTOR: Encryptor = {
    name: ['Transposition', 'Zaunmethode'],
    format: '[Reihen / Schlüssel]: [Plaintext]',
    encrypt(text: string, key?: string): string {
        if (!key) {
            throw FailReasons.NO_KEY_PROVIDED;
        }
        return encryptFence(parseInt(key, 10), text);
    },
    decrypt(encryptedText: string, key: string | undefined): string | Map<string | number, string> {
        if (key) {
            return decryptFence(parseInt(key, 10), encryptedText);
        }
        let results: Map<number, string> = new Map();
        for (let rows = 1; rows <= 15; rows++) {
            results.set(rows, decryptFence(rows, encryptedText));
        }
        return results;
    }
};

function encryptFence(rows: number, plainText: string): string {
    if (rows <= 1) {
        return plainText;
    }

    const columns = plainText.length;
    const fence = initializeFence(rows, columns);

    let pos = 0;
    fillZigZag(rows, columns, (row, col) => {
        fence[row][col] = plainText[pos++];
    });

    return fence.flat().filter(Boolean).join('');
}

function decryptFence(rows: number, encryptedText: string): string {
    if (rows <= 1) {
        return encryptedText;
    }

    const columns = encryptedText.length;
    const fence = initializeFence(rows, columns);

    // Mark the zig-zag pattern with placeholders
    fillZigZag(rows, columns, (row, col) => {
        fence[row][col] = '*';
    });

    // Fill the placeholders with the encrypted text
    let pos = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (fence[row][col] === '*') {
                fence[row][col] = encryptedText[pos++];
            }
        }
    }

    // Read the message in zig-zag order
    let result = '';
    fillZigZag(rows, columns, (row, col) => {
        result += fence[row][col];
    });

    return result;
}

/* Helper methods */

function initializeFence(rows: number, columns: number): string[][] {
    return Array.from({ length: rows }, () => Array(columns).fill(null));
}

function fillZigZag(rows: number, columns: number, callback: (row: number, col: number) => void): void {
    let row = 0;
    let direction = 1;

    for (let col = 0; col < columns; col++) {
        callback(row, col);
        row += direction;

        if (row === 0 || row === rows - 1) {
            direction *= -1;
        }
    }
}

/* Matrix Cipher */

export const MATRIX_ENCRYPTOR: Encryptor = {
    name: ['Transposition', 'Matrix'],
    format: '[Key]: [Plaintext]', // TODO
    encrypt(text: string, key: string | undefined): string {
        throw FailReasons.NOT_IMPLEMENTED;
    },
    decrypt(encryptedText: string, key: string | undefined): string | string[] | Map<string | number, string> {
        throw FailReasons.NOT_IMPLEMENTED;
        // SortedMap<String, String> results = new TreeMap<>();
        //
        // String key = "6304918257";
        //
        // char[] chars = encryptedText.toCharArray();
        //
        // Map<Character, char[]> columns = new HashMap<>();
        //
        // int rows = chars.length / key.length();
        //
        // key.chars().forEach(ch -> columns.put((char) ch, new char[rows]));
        //
        // int idx = 0;
        // for (int row = 0; row < rows; row++) {
        //
        // }
        //
        // return results;
    }
}