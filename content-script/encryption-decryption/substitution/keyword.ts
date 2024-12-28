import { Encryptor } from '../encryptor.js';
import { isUpperCaseLetter, nextLetter, upperAlphabetLetters } from '../utils.js';

export const KEYWORD_ENCRYPTOR: Encryptor<string> = {
    name: ['Substitution', 'Monoalphabetisch', 'Schlüsselwort'],
    key: {
        type: 'string',
        parseNumber: false,
        requiredForEncryption: true,
        requiredForDecryption: true
    },
    encrypt(text: string, key: string): string {
        return encryptKeyword(text, key, false);
    },
    decrypt(text: string, key: string): string {
        return encryptKeyword(text, key, true);
    }
};

function encryptKeyword(text: string, key: string, inverse: boolean) {
    const characters: Map<string, string> = new Map();

    // clean from duplicate letters and non-letter characters
    const cleanKey = [...new Set([...key.toUpperCase()])]
        .filter(isUpperCaseLetter)
        .join('');

    const usedLetters = new Set<string>();

    let previousLetter: string = 'Z';

    upperAlphabetLetters().forEach((letter, index) => {
        let matchingLetter: string;
        if (index < cleanKey.length) {
            matchingLetter = cleanKey.charAt(index);
        } else {
            matchingLetter = nextLetter(previousLetter);
            while (usedLetters.has(matchingLetter)) {
                matchingLetter = nextLetter(matchingLetter);
            }
        }
        characters.set(inverse ? matchingLetter : letter, inverse ? letter : matchingLetter);
        usedLetters.add(matchingLetter);
        previousLetter = matchingLetter;
    });

    console.log(characters);

    return [...text]
        .map((ch) => {
            const isUpper = isUpperCaseLetter(ch);
            const replacement = characters.get(ch.toUpperCase());
            return replacement ?
                (!isUpper ? replacement.toLowerCase() : replacement)
                : ch;
        }).join('');
}