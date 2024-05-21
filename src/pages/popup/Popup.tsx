import React, { useState, useEffect }  from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import Entry from './components/Entry'
import {saveWebsiteEntry, getWebsiteEntries, removeEntries, removeEntryFromStorage, checkIfExist} from './utils/storageLogic'
import {getUrlAndBlock, updateRules} from './utils/update';
import {createAlarm,removeAlarm} from '../background/alarms.js'


const Popup = () => {

  chrome.storage.onChanged.addListener(async(changes, namespace) => {
    const entries = await getWebsiteEntries();
    setEntries(entries);
    console.log("Updated Display")
  });

  const [entries, setEntries] = useState([]);
  const [newSearch, setNewSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [datetime, setDatetime] = useState('');

  // Function to fetch website entries and set them in state
  const fetchWebsiteEntries = async () => {
    const entries = await getWebsiteEntries();
    setEntries(entries);
    console.log("Saved entries to state",entries)
    await getUrlAndBlock(entries);
  };

  // useEffect to fetch entries when component mounts
  useEffect(() => {
    fetchWebsiteEntries();
  }, []);
  

  // Function to add current website to blocked list
  const addSite = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const current = tabs[0];
    const entry = { "name": current.title, "url": current.url, "expire": "30/05/2024" };
    if (await checkIfExist(entry)) return true;
    
    //console.log(entry)
    await saveWebsiteEntry(entry);

    // Fetch website entries to update the popup
    await fetchWebsiteEntries(); 
  };

  const removeSites = async ()=>{
    await removeEntries();
    await fetchWebsiteEntries();
  }

  const removeEntry = async (toDeleteEntry) => {
    console.log(toDeleteEntry)
    console.log(entries)
    const newEntries = entries.filter((entry)=>(entry.name!=toDeleteEntry.name && entry.url!=toDeleteEntry.url))
    console.log("removeEntry",newEntries)
    await removeEntryFromStorage(newEntries);
    await fetchWebsiteEntries();
    await removeAlarm(toDeleteEntry);
  }

  const handleSearchChange = (event)=>{
    console.log(event.target.value)
    setNewSearch(event.target.value)
  }
  const handleNameChange = (event)=>{
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const filterEntries = () => {
    return entries.filter(entry => entry.name.toLowerCase().includes(newSearch.toLowerCase()));
  };

  const entriesToShow = () =>{
    return newSearch ? filterEntries () : entries
  }

  const handleDateChange= (ev) => {
    if (!ev.target['validity'].valid) return;
    const dt= ev.target['value'];
    setDatetime(dt);
    console.log("Changed date:",datetime)
  }

  const addCustomSite= async (event)=>{
    event.preventDefault();
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const current = tabs[0];
    const entry = { 
      "name": current.title, 
      "url": current.url, 
      "expire": new Date(Date.now() + 60 * 60 * 1000).toISOString() 
    };
    if (await checkIfExist(entry)) return true;
    (newName !== '') ? (entry["name"] = newName) : null;
    (datetime !== '') ? (entry["expire"] = datetime) : null;
    console.log("Entry Date:",datetime)
    //console.log(entry)
    await saveWebsiteEntry(entry);

    // Fetch website entries to update the popup
    await fetchWebsiteEntries(); 

    await createAlarm(entry)

    setNewName('');
    setDatetime('');

  }

  const handleAlarm = async (Entry) =>{
    console.log("entry is being removed:", Entry.name)
    await removeEntry(Entry)
  }

  return (
    <div className='wrapper'>
      <div className="search-box">
        <input className= "search-bar" value={newSearch} placeholder="Search Blocked Sites..." onChange={handleSearchChange}/>
      </div>

      <div className='list-wrapper'>
        <ul className='unordered-list-wrapper'>
          {entriesToShow().map((entry, index) => (
            <Entry key={index} website_details={entry} deleteFunc={removeEntry}/>
          ))}
        </ul>
      </div>
      <div className="form-container">
        <form onSubmit={addCustomSite} className="form">
          <input value={newName} placeholder="Enter Custom Name" onChange={handleNameChange} className="name-box"/>
          <input type="datetime-local" value={(datetime || '').toString().substring(0, 16)} onChange={handleDateChange} className="date-box"/>
          <button type="submit" className="submit-button">ADD</button>
        </form>
        {/* <button onClick={fetchWebsiteEntries}>Reload</button> */}
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);


//style={{ width: '300px',height: '400px', overflow: 'scroll' }}
/*

      <button onClick={fetchWebsiteEntries}>Fetch Existing Websites</button>
      <button onClick={removeSites}>Remove all entries</button>
*/

/*
  return (
    <div className="container mx-auto my-10">
      <h2 className="text-center text-3xl font-semibold mb-4">Websites Blocked</h2>
      <div style={{ width: '300px',height: '400px', overflow: 'scroll' }}>
        <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
          {entries.map((entry, index) => (
            <Entry key={index} website_details={entry} deleteFunc={removeEntry}/>
          ))}
        </ul>
      </div>
      <button onClick={addSite}>Add Current Website</button>
    </div>
  );
  */