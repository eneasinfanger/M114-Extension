import { Encryptor } from '../encryptor.js';

export const MATRIX_ENCRYPTOR: Encryptor<string> = {
    name: ['Transposition', 'Matrix'],
    key: {
        type: 'integer',
        parseNumber: false,
        requiredForEncryption: true,
        requiredForDecryption: true,
    },
    encrypt(text: string, key: string): string {
        return encryptMatrixTransposition(text, parseKey(key))
    },
    decrypt(encryptedText: string, key: string): string {
        return decryptMatrixTransposition(encryptedText, parseKey(key))
    }
};

// key must be in integer format
function parseKey(key: string): number[] {
    return [...key].map(Number);
}

function encryptMatrixTransposition(plainText: string, key: number[]): string {
    const numRows = Math.ceil(plainText.length / key.length);
    const numCols = key.length;

    // Matrix erstellen und den Klartext einfüllen
    const matrix: string[][] = Array.from({ length: numRows }, () => Array(numCols).fill(' '));
    let index = 0;
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (index < plainText.length) {
                matrix[row][col] = plainText[index++];
            }
        }
    }

    // Verschlüsseln: Spalten basierend auf dem Schlüssel auslesen
    const sortedKey = [...key].map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
    let cipherText = '';

    for (const { idx } of sortedKey) {
        for (let row = 0; row < numRows; row++) {
            cipherText += matrix[row][idx];
        }
    }

    return cipherText;
}

// Funktion zum Entschlüsseln
function decryptMatrixTransposition(cipherText: string, key: number[]): string {
    const numRows = Math.ceil(cipherText.length / key.length);
    const numCols = key.length;

    // Matrix für die Entschlüsselung erstellen
    const matrix: string[][] = Array.from({ length: numRows }, () => Array(numCols).fill(' '));
    const sortedKey = [...key].map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);

    let index = 0;
    for (const { idx } of sortedKey) {
        for (let row = 0; row < numRows; row++) {
            if (index < cipherText.length) {
                matrix[row][idx] = cipherText[index++];
            }
        }
    }

    // Klartext aus der Matrix auslesen
    let plainText = '';
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            plainText += matrix[row][col];
        }
    }

    return plainText.trim();
}