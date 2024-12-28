export interface Encryptor<keyType extends string | number | undefined> {
    name: string[];
    key: {
        type: 'string' | 'integer' | 'none'
        parseNumber: boolean
        requiredForEncryption: boolean
        requiredForDecryption: boolean
    };
    encrypt: (text: string, key: keyType) => string;
    decrypt: (encryptedText: string, key: keyType) => string | string[] | Map<string | number, string>;
}