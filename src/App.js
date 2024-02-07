import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Vote from './vote';
import Detial from './detail';
import NewVote from './new_vote';
import Login from './login';


import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { Relay, generateSecretKey, getPublicKey } from 'nostr-tools'
import { finalizeEvent, verifyEvent } from 'nostr-tools'


function App() {


  // const relay = await Relay.connect('wss://relay.example.com')
  useEffect(() => {
    connectAndSubscribe();
  }, []);

  async function connectAndSubscribe() {
    try {
      const relay = await Relay.connect('ws://47.129.0.53:8080');
      console.log(`Connected to ${relay.url}`);


      
      const sub = relay.subscribe(
        [
          {
            ids: ['0c6790fa6ffe648571a5a322a3d4410a610d9bfca015be354f9d7811ab2510ae'],
          },
        ],
        {
          onevent(event) {
            console.log('We got the event we wanted:', event);
          },
          oneose() {
            sub.close();
          },
        }
      );

      let sk = generateSecretKey();
      let pk = getPublicKey(sk);

      relay.subscribe(
        [
          {
            kinds: [1],
            authors: [pk],
          },
        ],
        {
          onevent(event) {
            console.log('Got event:', event);
          },
        }
      );

      let eventTemplate = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'hello world',
      };

      const signedEvent = finalizeEvent(eventTemplate, sk);
      await relay.publish(signedEvent);

      relay.close();
    } catch (error) {
      console.error('Error:', error);
    }
  }



  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Vote />} />
        <Route path="/login" element={<Login />} />
        <Route path="/detail/:param" element={<Detial />} />
        <Route path="/newvote" element={<NewVote />} />

      </Routes>
    </BrowserRouter>

    // <div>
    //    <p>hello</p>
    //    <Vote />
    //   </div>






  );
}



export default App;
