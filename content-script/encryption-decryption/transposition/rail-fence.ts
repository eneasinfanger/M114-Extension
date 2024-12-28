import { Encryptor } from '../encryptor.js';

export const FENCE_ENCRYPTOR: Encryptor<number> = {
    name: ['Transposition', 'Zaunmethode'],
    key: {
        type: 'integer',
        parseNumber: true,
        requiredForEncryption: true,
        requiredForDecryption: false,
    },
    encrypt(text: string, key: number): string {
        return encryptFence(key, text);
    },
    decrypt(encryptedText: string, key: number | undefined): string | Map<string | number, string> {
        if (key) {
            return decryptFence(key, encryptedText);
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