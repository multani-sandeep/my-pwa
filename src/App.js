import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import './App.css';


function Home() {
	
	const isLocalhostEnv = Boolean(
	  window.location.hostname === 'localhost' ||
	    // [::1] is the IPv6 localhost address.
	    window.location.hostname === '[::1]' ||
	    // 127.0.0.0/8 are considered localhost for IPv4.
	    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
	);
	
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
		 	if(isLocalhostEnv)devSubscribe();
	         const registration = await navigator.serviceWorker.ready;
	 		const subscription = registration.pushManager.subscribe({
	 			userVisibleOnly: true,
	 			applicationServerKey: "BMPstOfOA-L8A6NEM3-MSXHk3sBYj2hm8RSaCI_pUCkb7iFg3FuhDJRIUmPh9k2o__yqbLQAFonjNHp1k0PIjec"
	 		});
	 		// console.log(subscription);
			subscription.then(async function(subscription){
				console.log(subscription.toJSON());
			    // Persist subscription to backend
			    await fetch("/.netlify/functions/data-subscription", {
			      method: "POST",
			      headers: { "Content-Type": "application/json" },
			      body: JSON.stringify(subscription),
			    });
			
			})
			
			
			
	         return subscription;
	     }
		 
		 const devSubscribe = async () => {
		 
		 fetch("/.netlify/functions/data-subscription", {
		 			      method: "POST",
		 			      headers: { "Content-Type": "application/json" },
		 			      body: JSON.stringify({endpoint: "dummy", keys: { p256dh: "HEllo Title", auth: "Hello body"}}),
		 			    });
		 }
		 
		 const sendNotification = async () =>{
		         const registration = await navigator.serviceWorker.ready;
			     const title = "Push title from button";
			     const options = {
			       body: "Push body from button",
			       icon: "/logo192.png",
			       badge: "/logo192.png"
			     };
				 registration.showNotification(title, options);
				 new window.Notification(title, options);
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
		<button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={sendNotification}
        >
          Send local Push notification
        </button>	
		<Link to="/manage"><button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          
        >Manage subscriptions
        </button></Link>
      </header>
   
    </div>
  );
}



function ManageSubscriptions() {
  const [subs, setSubs] = useState([]);
  const [selected, setSelected] = useState("all");
  const [message, setMessage] = useState("Hello from PWA!");

  useEffect(() => {
    fetch("/.netlify/functions/data-subscription")
      .then((res) => res.json())
      .then((data) => setSubs(data));
  }, []);

  const sendPush = async () => {
    const response = await fetch("/.netlify/functions/send-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target: selected,
        message,
      }),
    });

    if (response.ok) {
      alert("Push sent successfully");
    } else {
      alert("Failed to send push");
    }
  };

  return (
    <div>
      <h2>Manage Subscriptions</h2>
      <label>
        Select subscription:
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="all">All</option>
          {subs.map((s) => (
            <option key={s.id} value={s.endpoint}>
              {s.endpoint.slice(0, 40)}...
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Message:
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "300px" }}
        />
      </label>
      <br />
      <button onClick={sendPush}>Send Push</button><br/>
	  <Link to="/">Go back</Link>  	  
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage" element={<ManageSubscriptions />} />
      </Routes>
    </Router>
  );
}
