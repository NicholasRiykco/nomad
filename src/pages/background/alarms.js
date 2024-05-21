import {saveWebsiteEntry, getWebsiteEntries, removeEntries, removeEntryFromStorage, checkIfExist} from '../popup/utils/storageLogic'
import {getUrlAndBlock, updateRules} from '../popup/utils/update.jsx';

console.log("Alarm.js found")



const handleAlarm= async(toDeleteEntry)=>{
    const store = await (chrome.storage.local.get('entries'))
    const entries = store.entries
    const newEntries = entries.filter((entry)=>(entry.name!=toDeleteEntry.name && entry.url!=toDeleteEntry.url))
    await removeEntryFromStorage(newEntries);
    await getUrlAndBlock(newEntries);
}

async function checkAlarmState() {
    // Make Alarm Persistent through storage and remove alarm past expirty

    await chrome.alarms.clearAll()
    const store = await (chrome.storage.local.get('entries'))
    const entries = store.entries
    console.log("ENTRIES", entries)
    entries.map(async(entry)=>{
        const expireTime = new Date(entry.expire).getTime();
        console.log("name:",entry.name,"expireTime:", expireTime); // Debugging line
        if (expireTime < new Date(Date.now())){
            const newEntries = entries.filter((webE)=>(webE.url!=entry.url))
            await removeEntryFromStorage(newEntries);
            await getUrlAndBlock(newEntries);
            await chrome.alarms.clear(entry.name)
            console.log("Removed", entry.name)
        }else{
            await chrome.alarms.create(entry.name, {when: expireTime});
            await chrome.alarms.onAlarm.addListener(() => handleAlarm(entry));    
        }
    })
}

checkAlarmState();
