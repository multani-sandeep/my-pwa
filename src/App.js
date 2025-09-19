import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
	
    const requestNotificationPermission = async () => {
       try {
         const permission = await Notification.requestPermission();
         if (permission === "granted") {
           alert("Notification permission granted!");
         } else if (permission === "denied") {
           alert("Notification permission denied.");
         } else {
           alert("Notification permission dismissed.");
         }
       } catch (error) {
         console.error("Error requesting notification permission:", error);
       }
     };
	 
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
	      CommitId: $Id$ 
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
   <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={requestNotificationPermission}
        >
          Enable Notifications
        </button>
    </div>
  );
}

export default App;
