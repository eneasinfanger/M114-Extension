package org.example;

import java.util.HashMap;
import java.util.Map;

public class Decryter {
    public static void main(String[] args) {
        String text = "L8la␣␣beyrPomer";
        var decrypter = new Decryter(text);
        decrypter.tryReverse();
        decrypter.trySubstitutionCaesar();
        decrypter.tryTranspositionFence(2, 15);
    }

    private final String encrypted;

    public Decryter(String encrypted) {
        this.encrypted = encrypted;
    }

    private void tryReverse() {
        System.out.println("Reversed: " + new StringBuilder(encrypted).reverse());
    }

    private void trySubstitutionCaesar() {
        System.out.println("Caesar Substitution: [Key: Plaintext]");
        char[] text = encrypted.toLowerCase().toCharArray();
        for (int i = 1; i <= 26; i++) {
            char[] chars = text.clone();
            for (int j = 0; j < chars.length; j++) {
                chars[j] = nextLetter(chars[j], i);
            }
            System.out.println(i + ": " + new String(chars));
        }
    }

    private static char nextLetter(char c, int i) {
        if (!Character.isLetter(c)) return c;
        c = (char) (c + i);
        if (c > 'z') return (char) (c - 26);
        return c;
    }

    public void tryTranspositionFence(int minKey, int maxKey) {
        System.out.println("Fence Transposition: [Key: Plaintext]");
        for (int key = minKey; key <= maxKey; key++) {
            tryDecryptFence(key);
        }
    }

    private void tryDecryptFence(int rows) {
        int columns = encrypted.length();

        char[][] fence = new char[rows][columns];

        // fill diagonal with char.MAX_VALUE
        int row = 0, direction = 1;
        for (int col = 0; col < columns; col++) {
            fence[row][col] = Character.MAX_VALUE;
            row += direction;

            if (row == 0 || row == fence.length - 1) direction *= -1;
        }

        int pos = 0;

        for (int fenceRow = 0; fenceRow < rows; fenceRow++) {
            for (int fenceCol = 0; fenceCol < columns; fenceCol++) {
                if (fence[fenceRow][fenceCol] == Character.MAX_VALUE) {
                    fence[fenceRow][fenceCol] = encrypted.charAt(pos++);
                }
            }
        }

        var resultSb = new StringBuilder();

        row = 0;
        direction = 1;
        for (int col = 0; col < columns; col++) {
            resultSb.append(fence[row][col]);
            row += direction;

            if (row == 0 || row == fence.length - 1) direction *= -1;
        }

        System.out.println(rows + ": " + resultSb);
    }

    private void tryTranspositionMatrix() {
        String key = "6304918257";

        char[] chars = encrypted.toCharArray();

        Map<Character, char[]> columns = new HashMap<>();

        int rows = chars.length / key.length();

        key.chars().forEach(ch -> columns.put((char) ch, new char[rows]));

        int idx = 0;
        for (int row = 0; row < rows; row++) {

        }
    }
}