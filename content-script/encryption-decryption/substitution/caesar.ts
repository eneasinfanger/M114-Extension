import { Encryptor } from '../encryptor.js';
import { ALPHABET_SIZE, nextLetter } from '../utils.js';

export const CAESAR_ENCRYPTOR: Encryptor<number> = {
    name: ['Substitution', 'Monoalphabetisch', 'Caesar-Methode'],
    key: {
        type: 'integer',
        parseNumber: true,
        requiredForEncryption: true,
        requiredForDecryption: false
    },
    encrypt(text: string, key: number): string {
        return caesarEncrypt(text, key);
    },
    decrypt(encryptedText: string, key: number | undefined): string | Map<string | number, string> {
        if (key) {
            return caesarEncrypt(encryptedText, -key);
        }
        const results: Map<number, string> = new Map();

        for (let shift = -1; shift >= -ALPHABET_SIZE; shift--) {
            results.set(-shift, caesarEncrypt(encryptedText, shift));
        }

        return results;
    }
};

function caesarEncrypt(text: string, shift: number): string {
    const letters: string[] = [...text];
    for (let j = 0; j < letters.length; j++) {
        letters[j] = nextLetter(letters[j], shift);
    }

    return letters.join('');
}