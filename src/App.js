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
	 
	 const subscribeUser = async () =>{
	         const registration = await navigator.serviceWorker.ready;
	 		const subscription = registration.pushManager.subscribe({
	 			userVisibleOnly: true,
	 			applicationServerKey: "BMPstOfOA-L8A6NEM3-MSXHk3sBYj2hm8RSaCI_pUCkb7iFg3FuhDJRIUmPh9k2o__yqbLQAFonjNHp1k0PIjec"
	 		});
	 		// console.log(subscription);
			console.log(subscription.then(function(subscription){console.log(subscription.toJSON());}));
	         return subscription;
	     }
	
	 
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
	  
        <p> Test1<br/>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a><br/>
   <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={subscribeUser}
        >
          Subscribe user
        </button><button
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
      </header>
   
    </div>
  );
}

export default App;
