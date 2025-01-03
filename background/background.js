chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({ text: 'ON' });
    chrome.action.setBadgeTextColor({ color: 'green' });
});

chrome.action.onClicked.addListener(async (tab) => {
    const prevState = await chrome.action.getBadgeText({});

    let wasOff = prevState === 'OFF';

    await chrome.action.setBadgeTextColor({ color: wasOff ? 'green' : 'red' });
    await chrome.action.setBadgeText({ text: wasOff ? 'ON' : 'OFF' });

    const tabs = await chrome.tabs.query({});
    for (let tab of tabs) {
        try {
            await chrome.tabs.sendMessage(tab.id, wasOff);
            console.log('sent message to tab', tab.url);
        } catch (_) {
            console.warn('extension script not loaded on tab', tab.url);
        }
    }
});