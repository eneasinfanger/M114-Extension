export interface Encryptor {
    name: string[],
    format?: string,
    encrypt: (text: string, key?: string) => string;
    decrypt: (encryptedText: string, key?: string) => string | string[] | Map<string | number, string>;
}