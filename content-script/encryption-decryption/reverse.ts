import { Encryptor } from './encryptor.js';

const reverse = (str: string) => [...str].reverse().join('');

export const REVERSE_ENCRYPTOR: Encryptor<undefined> = {
    name: ['Umgekehrt (Reversed)'],
    key: {
        type: 'none',
        parseNumber: false,
        requiredForDecryption: false,
        requiredForEncryption: false
    },
    encrypt(text: string): string {
        return reverse(text);
    },
    decrypt(encryptedText: string): string {
        return reverse(encryptedText);
    }
};