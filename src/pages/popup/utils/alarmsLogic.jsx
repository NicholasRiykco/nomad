import './storageLogic'

const createAlarm = async (entry, handleAlarm) => {
    const expireTime = new Date(entry.expire).getTime();
    console.log("expireTime:", expireTime); // Debugging line
    await chrome.alarms.create(entry.name, {when: expireTime});
    console.log("Created Alarm", entry.name, entry.expire);
    await chrome.alarms.onAlarm.addListener(() => handleAlarm(entry));
    const alarms = await chrome.alarms.getAll()
    console.log(alarms);
}

export { createAlarm };