chrome.runtime.onInstalled.addListener(async () => {
    const enabled = (await chrome.storage.sync.get(["enabled"])).enabled;
    if (enabled === undefined) {
        await chrome.storage.sync.set({ enabled: true });
    }

    await chrome.action.setBadgeText({ text: enabled ? 'ON' : 'OFF' });
    await chrome.action.setBadgeTextColor({ color: enabled ? 'green': 'red' });
});

async function getEnabled() {
    return (await chrome.storage.sync.get(['enabled'])).enabled;
}

chrome.runtime.onStartup.addListener(async () => {
    const enabled = await getEnabled();

    await chrome.action.setBadgeText({ text: enabled ? 'ON' : 'OFF' });
    await chrome.action.setBadgeTextColor({ color: enabled ? 'green': 'red' });

    await sendMessageToAllTabs(enabled);
})

chrome.tabs.onCreated.addListener(async tab => {
    const enabled = await getEnabled();

    if (!await chrome.action.getBadgeText({}) || !await chrome.action.getBadgeTextColor({})) {
        await chrome.action.setBadgeText({ text: enabled ? 'ON' : 'OFF' });
        await chrome.action.setBadgeTextColor({ color: enabled ? 'green': 'red' });
    }

    await sendMessageToTab({ ...tab, url: tab.url || '[url not set yet: tab recently created]' }, enabled);
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    await sendMessageToTab({ id: tabId || tab.id, url: changeInfo.url || tab.url }, await getEnabled());
});

/* *********************************** ACTION ICON CLICKED *********************************** */

chrome.action.onClicked.addListener(async (tab) => {
    const wasEnabled = await getEnabled();
    const isEnabled = !wasEnabled;

    await chrome.storage.sync.set({ enabled: isEnabled });

    await chrome.action.setBadgeTextColor({ color: isEnabled ? 'green' : 'red' });
    await chrome.action.setBadgeText({ text: isEnabled ? 'ON' : 'OFF' });

    await sendMessageToAllTabs(isEnabled);
});

async function sendMessageToTab(tab, message) {
    try {
        await chrome.tabs.sendMessage(tab.id, message);
    } catch (_) {
        //console.warn('couldn\'t send message \'' + message + '\': extension script not loaded on tab', tab.url);
    }
}

async function sendMessageToAllTabs(message) {
    const tabs = await chrome.tabs.query({});
    for (let tab of tabs) {
        await sendMessageToTab(tab, message);
    }
}