import { createCustomMenu, removeCustomMenu } from './menu.js';

document.addEventListener("mouseup", (event) => {
    const customMenu = document.getElementById("custom-menu");
    if (customMenu && customMenu.contains(event.target as Node | null)) {
        return;
    }

    const selection = window.getSelection();
    const selectionText = selection?.toString().trim()

    if (selection && selectionText) {
        const bounds = selection.getRangeAt(0).getBoundingClientRect();

        createCustomMenu(bounds.x, bounds.y+50, selectionText);
    } else {
        removeCustomMenu();
    }
});

document.addEventListener("mousedown", (event) => {
    const customMenu = document.getElementById("custom-menu");
    if (customMenu && !customMenu.contains(event.target as Node | null)) {
        removeCustomMenu();
    }
});

document.addEventListener("scroll", () => { // Update menu position on scroll
    const menu = document.getElementById("custom-menu");
    if (menu) {
        const initialX = parseFloat(menu.dataset.initialX!);
        const initialY = parseFloat(menu.dataset.initialY!);
        menu.style.top = `${initialY + window.scrollY}px`;
        menu.style.left = `${initialX + window.scrollX}px`;
    }
});