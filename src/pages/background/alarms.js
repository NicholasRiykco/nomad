import {saveWebsiteEntry, getWebsiteEntries, removeEntries, removeEntryFromStorage, checkIfExist} from '../popup/utils/storageLogic'
import {getUrlAndBlock, updateRules} from '../popup/utils/update.jsx';

console.log("Alarm.js found")

const handleAlarm= async (toDeleteEntry)=>{
    const json = JSON.stringify(toDeleteEntry);
    console.log(`Alarm "${toDeleteEntry.name}" fired\n${json}`);
    const localStore = await getWebsiteEntries();
    const newEntries = localStore.filter(entry=>entry.name!=toDeleteEntry.name && entry.url!=toDeleteEntry.url)
    await removeEntryFromStorage(newEntries)
    await getUrlAndBlock(newEntries);

}

chrome.alarms.onAlarm.addListener(handleAlarm);

const createAlarm = async (entry) => {
    const expireTime = new Date(entry.expire).getTime();
    console.log("expireTime:", expireTime);
    await chrome.alarms.create(entry.name, { when: expireTime });
    console.log("Created Alarm", entry.name, entry.expire);
};

const removeAlarm = async(entry)=>{
    console.log("removing alarm" );
    await chrome.alarms.clear(entry.name)
    const currAlarm = await chrome.alarms.getAll()
    console.log("Current Alarms", currAlarm)
}

export {createAlarm, removeAlarm}