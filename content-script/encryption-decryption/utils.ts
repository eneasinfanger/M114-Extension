export const ALPHABET_SIZE: number = 26;
const UPPER_A_CC = 'A'.charCodeAt(0);
const UPPER_Z_CC = 'Z'.charCodeAt(0);
const LOWER_Z_CC = 'z'.charCodeAt(0);

let upperAlphabetLettersArr: string[];

export function upperAlphabetLetters(): string[] {
    if (!upperAlphabetLettersArr) {
        upperAlphabetLettersArr = [];
        for (let l = UPPER_A_CC; l <= UPPER_Z_CC; l++) {
            upperAlphabetLettersArr.push(String.fromCharCode(l));
        }
    }
    return upperAlphabetLettersArr;
}

export const isLowerCaseLetter = (ch: string) => ch >= 'a' && ch <= 'z';
export const isUpperCaseLetter = (ch: string) => ch >= 'A' && ch <= 'Z';

export function nextLetter(letter: string, amount: number = 1): string {
    const isLower = isLowerCaseLetter(letter);
    const isUpper = isUpperCaseLetter(letter);
    if (!isLower && !isUpper) {
        return letter;
    }

    let letterCc = letter.charCodeAt(0) + amount;
    if (letterCc > (isUpper ? UPPER_Z_CC : LOWER_Z_CC)) {
        letterCc -= ALPHABET_SIZE;
    }
    return String.fromCharCode(letterCc);
}

export enum FailReasons {
    NO_KEY_PROVIDED,
    NOT_IMPLEMENTED
}