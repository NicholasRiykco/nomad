import React from 'react';

let blockerUrlList;

const getUrlAndBlock = async (entries) =>{
    await updateRules(entries)
}


const updateRules = async (blockUrls) => {
    console.log("Updating rules");
    let id = 1;
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    const oldRuleIds = oldRules.map(rule => rule.id);
    const newRules = blockUrls.map(website => ({
        "id": id++,
        "priority": 1,
        "action": { "type": "block" },
        "condition": { "urlFilter": website.url, "resourceTypes": ["main_frame"] }
    }));

    console.log("old",oldRules)
    console.log("new",newRules)

    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRuleIds,
        addRules: newRules
    });

    const currentRules =await chrome.declarativeNetRequest.getDynamicRules();
    console.log("Current Rules", currentRules)
    console.log("Rules updated");
    console.log("Alarms",await chrome.alarms.getAll())
}



export {getUrlAndBlock, updateRules}

