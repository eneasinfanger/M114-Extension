import { Encryptor } from './encryptor.js';

const reverse = (str: string) => [...str].reverse().join('');

export const REVERSE_ENCRYPTOR: Encryptor = {
    name: ['Umgekehrt (Reversed)'],
    encrypt(text: string): string {
        return reverse(text);
    },
    decrypt(encryptedText: string, key: string | undefined): string {
        return reverse(encryptedText);
    }
};