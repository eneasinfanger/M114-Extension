/* event listeners */

document.addEventListener("mouseup", (event) => {
    const customMenu = document.getElementById("custom-menu");
    if (customMenu && customMenu.contains(event.target)) {
        return;
    }

    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        createCustomMenu(event.clientX, event.clientY, selectedText); // Use clientX/clientY for viewport positioning
    } else {
        removeCustomMenu();
    }
});

document.addEventListener("mousedown", (event) => {
    const customMenu = document.getElementById("custom-menu");
    if (customMenu && !customMenu.contains(event.target)) {
        removeCustomMenu();
    }
});

document.addEventListener("scroll", () => { // Update menu position on scroll
    const menu = document.getElementById("custom-menu");
    if (menu) {
        const initialX = parseFloat(menu.dataset.initialX);
        const initialY = parseFloat(menu.dataset.initialY);
        menu.style.top = `${initialY + window.scrollY}px`;
        menu.style.left = `${initialX + window.scrollX}px`;
    }
});

/* main functions */

function createCustomMenu(x, y, text) {
    removeCustomMenu(); // Remove any existing menu

    const menu = createMenuElement();

    // Add selected text to the menu
    const textDisplay = document.createElement("div");
    textDisplay.textContent = `Selected Text: "${text}"`;
    textDisplay.style.marginBottom = "10px";
    menu.appendChild(textDisplay);

    // Add buttons to the menu
    for (let i = 1; i <= 4; i++) {
        appendAction(menu, {name: `Action ${i}`, cryptionFunc: () => 'console.log(`action ${i} called`)', decryptConfig: {}, text: text});
    }

    document.body.appendChild(menu);
}

function removeCustomMenu() {
    const existingMenu = document.getElementById("custom-menu");
    if (existingMenu) {
        existingMenu.remove();
    }
}

function createMenuElement() {
    const menu = document.createElement("div");
    menu.id = "custom-menu";

    // Style the menu
    Object.assign(menu.style, {
        position: "absolute", // Absolute positioning for manual scrolling updates
        top: `${y + window.scrollY}px`,
        left: `${x + window.scrollX}px`,
        transform: "translateX(-50%)", // Center horizontally
        backgroundColor: "black",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        zIndex: "1000",
        display: "inline-block",
        pointerEvents: "auto", // Allow interactions
        textAlign: "center",
    });

    menu.dataset.initialX = x;
    menu.dataset.initialY = y;

    return menu;
}

function appendAction(menu, properties) {
    menu.appendChild(
        createButton(properties.name, (e) => {
           e.stopPropagation(); // Prevent propagation to avoid reopening the menu
            createActionMenu(x, y + 50, properties);
        })
    );
}

function createButton(label, callback) {
    const button = document.createElement("button");
    button.textContent = label;
    button.style.margin = "5px";
    button.style.padding = "5px 10px";
    button.style.fontSize = "14px";
    button.style.cursor = "pointer";
    button.onclick = callback;
    return button;
}

const x  = {name: `Action ${i}`, cryptionFunc: () => 'console.log(`action ${i} called`)', decryptConfig: {}, text: text};

function createActionMenu(x, y, properties) {
    removeCustomMenu(); // Remove existing menu before creating the new one

    const menu = createMenuElement();

    // Add greeting message
    const messageDisplay = document.createElement("div");
    messageDisplay.textContent = properties.name;
    messageDisplay.style.marginBottom = "10px";
    menu.appendChild(messageDisplay);

    // Add input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "key (optional)";
    inputField.style.padding = "5px";
    inputField.style.fontSize = "14px";
    inputField.style.width = "calc(100% - 10px)";
    menu.appendChild(inputField);

    menu.appendChild(
        createButton('submit', (e) => {
            
        })
    );

    document.body.appendChild(menu);
}

/* encryption functions */

/* decryption functions */

function decryptCaesar(config, text, key) {

}