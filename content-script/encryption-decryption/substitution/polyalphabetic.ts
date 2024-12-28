import { Encryptor } from '../encryptor.js';

export const POLYALPHABETIC_ENCRYPTOR: Encryptor<string> = { // TODO: logic
    name: ['Substitution', 'Polyalphabetisch'],
    key: {
        type: 'integer',
        parseNumber: false,
        requiredForEncryption: true,
        requiredForDecryption: true,
    },
    encrypt(text: string, key: string): string {
        throw -1;
    },
    decrypt(encryptedText: string, key: string): string {
        throw -1;
    }
};

/*
Erkenntnisse aus der Kryptoanalyse zeigen, dass eine monoalphabetische Substitution keine zufriedenstellende Verschlüsselung erzieht. Diesem Problem tritt die polyalphabetische Substitution entgegen. Bei diesem Verfahren wird für die Substitution nicht ein Zeichensatz, sondern mehrere genutzt.

Jedes Zeichen erhält seinen eigenen Zeichensatz, mit welchem es ersetzt wird.

 Beispiel
In diesem Beispiel werden zwei Zeichensätze erstellt. Die Zeichen des Klartextes werden abwechslungsweise durch ein Zeichen vom Zeichensatz 1 und Zeichensatz 2 ersetzt.

Alphabet	A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
Zeichensatz 1	F I R S T U V W X Y Z A B C D E G H J K L M N O P Q
Zeichensatz 2	S E C O N D F G H I J K L M P Q R T U V W X Y Z A B
Klartext Mein Geheimnis
Generierter Cipher: Bnxm Vnwnxlchj

Zwei Zeichensätze erschweren eine Kryptoanalyse, verunmöglichen sie aber nicht. Damit keine Attacke durch Analyse der Buchstabenhäufigkeit vorgenommen werden kann, müssen theoretisch so viele Zeichensätze vorliegen, wie der Text Buchstaben haben kann.
 */