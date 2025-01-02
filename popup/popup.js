const txt = document.getElementById('txt');

(async () => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {action: 'toggleEnabled'});
    loadText(response);
})();

chrome.action.setBadgeTextColor({color: 'red'});

function loadText(enabled) {
    chrome.action.setBadgeText({text: enabled ? '' : 'X'});

    txt.textContent = enabled ? 'Enabled extension' : 'Disabled extension';
    txt.style.color = enabled ? 'green' : 'red';
}