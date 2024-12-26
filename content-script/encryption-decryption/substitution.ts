import { ALPHABET_SIZE, FailReasons, isUpperCaseLetter, nextLetter, upperAlphabetLetters } from './utils.js';
import { Encryptor } from './encryptor.js';

export const CAESAR_ENCRYPTOR: Encryptor = {
    name: ['Substitution', 'Monoalphabetisch', 'Caesar-Methode'],
    format: '[Verschiebung / Schlüssel]: [Plaintext / Verschlüsselter Text]',
    encrypt(text: string,  key?: string): string {
        if (!key) {
            throw FailReasons.NO_KEY_PROVIDED;
        }
        return caesarEncrypt(text, parseInt(key, 10));
    },
    decrypt(encryptedText: string, key: string | undefined): string | Map<string | number, string> {
        if (key) {
            return caesarEncrypt(encryptedText, parseInt(key, 10));
        }
        const results: Map<number, string> = new Map();

        for (let shift = 1; shift <= ALPHABET_SIZE; shift++) {
            results.set(shift, caesarEncrypt(encryptedText, shift));
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

export const KEYWORD_ENCRYPTOR: Encryptor = {
    name: ['Substitution', 'Monoalphabetisch', 'Schlüsselwort'],
    encrypt(text: string, key?: string): string {
        return encryptKeyword(text, key, false);
    },
    decrypt(text: string, key?: string): string{
        return encryptKeyword(text, key, true);
    }
};

function encryptKeyword(text: string, key: string | undefined, inverse: boolean) {
    if (!key) {
        throw FailReasons.NO_KEY_PROVIDED;
    }

    const characters: Map<string, string> = new Map();

    // clean from duplicate letters and non-letter characters
    const cleanKey = [...new Set([...key.toUpperCase()])]
        .filter(isUpperCaseLetter)
        .join('');

    if (inverse) {
        upperAlphabetLetters().forEach((letter, index) => {
            characters.set(index < cleanKey.length
                ? cleanKey.charAt(index)
                : nextLetter(letter, cleanKey.length), letter);
        });
    } else {
        upperAlphabetLetters().forEach((letter, index) => {
            characters.set(letter, index < cleanKey.length
                ? cleanKey.charAt(index)
                : nextLetter(letter, cleanKey.length));
        });
    }

    return [...text]
        .map((ch) => {
            const isUpper = isUpperCaseLetter(ch);
            const replacement = characters.get(ch);
            return replacement ?
                (!isUpper ? replacement.toLowerCase() : replacement)
                : ch;
        }).join('');
}