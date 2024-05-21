import React from 'react';

// Store CSS data in the "local" storage area
const localStorage = chrome.storage.local;



const checkIfExist = async (Entry) =>{
  try {
    let websiteEntries = await localStorage.get('entries');
    const found = websiteEntries.entries.find((entry)=>(entry.url===Entry.url))
    console.log("Website exist")
    return found ? true : false;
  } catch (error) {
    console.error("Error Matching website entry:", error);

  }
}
const saveWebsiteEntry = async (Entry) => {

  try {
    // Create Entry dictionary to store
    console.log("Entry to be saved", Entry)

    const websiteEntry = { "name": Entry["name"], "url": Entry["url"], "expire": Entry["expire"] };

    // Retrieve existing entries from localStorage
    let websiteEntries = await localStorage.get('entries');
    // Check if websiteEntries is null or undefined
    if (!websiteEntries.entries) {
      console.log("No Entries defined")
      websiteEntries = [];
      websiteEntries.push(websiteEntry)
    }else{
      // Add the new entry to the existing entries
      console.log("Entries Found", websiteEntries)
      websiteEntries = [...websiteEntries.entries, websiteEntry];
    }
    console.log("Attempt to save")
    // Set the updated entries back to localStorage
    await localStorage.set({ 'entries': websiteEntries });
    console.log("Entry saved");
  } catch (error) {
    console.error("Error saving website entry:", error);
    // You may add further error handling or logging here if needed
  }
};

const getWebsiteEntries = async () => {
  try {
    // Get website entries 
    const store = await localStorage.get('entries');
    // Confirm await is done
    console.log("Entry retrieved");
  
    // Return empty string if store is empty else returned the whole store
    return store.entries !== null && store.entries !== undefined ? store.entries : [];
  } catch (error) {
    console.error("Error retrieving website entries:", error);
    // You may add further error handling or logging here if needed
    return []; // Returning empty array in case of error
  }
};

const removeEntries = async () =>{ 
  await localStorage.remove('entries')
  console.log("Entries all removed")
}

const removeEntryFromStorage = async (newEntries)=>{
  try{
    await localStorage.set({'entries': newEntries})
    console.log("Removed Entry")
  }catch(error){
    console.error("Error removing entry:", error);
  }
}



export {saveWebsiteEntry, getWebsiteEntries,removeEntries, removeEntryFromStorage, checkIfExist}