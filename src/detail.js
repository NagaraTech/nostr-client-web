
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import logopng from './logo.png'
import { Relay, generateSecretKey, getPublicKey } from 'nostr-tools';
import { finalizeEvent } from 'nostr-tools';

import { getDatabase, ref, push, set, onValue } from "firebase/database";



let choiceValue ='single'

function Detial() {

  const { id } = useParams();
  console.log("id", id);
  const [InitSearchData, setInitSearchData] = useState([{
    id: "key",
    title: "item.tags[3]",
    info: "item.tags[4]}]"
  }]);

  const [voteId, setVoteId] = useState('7af75a57a5d');
  const [multipleChoice, setMultipleChoice] = useState('Single choice voting');
  const [startDate, setStartDate] = useState('Jan 30, 2024, 1:17 AM');
  const [endDate, setEndDate] = useState('Feb 6, 2024, 1:17 AM');
  const [options, setOptions] = useState(['A', 'B', 'C']);
  const [addr, setAddr] = React.useState('0x1231');


  useEffect(() => {
    Init();
    let local_sk = localStorage.getItem('sk')

    const numberArray = local_sk.split(",").map(Number)
    // 确保数组长度为32
    while (numberArray.length < 32) {
        numberArray.push(0); // 填充0
    }
    let sk = numberArray.map(num => num.toString(16).padStart(2, '0')).join('');;
    console.log('sk', sk)

    setAddr('0x' + getPublicKey(sk))
  }, []);


  async function Init() {



    const firebaseConfig = {
      apiKey: "AIzaSyCgRzMHIfhPZnIXedgNuqqoyQz5sausEu8",
      authDomain: "vote-2b9d8.firebaseapp.com",
      projectId: "vote-2b9d8",
      storageBucket: "vote-2b9d8.appspot.com",
      messagingSenderId: "1050103509183",
      appId: "1:1050103509183:web:15565360fa1d58fe96560a",
      measurementId: "G-NZXRF34DPT",
      databaseURL: "https://vote-2b9d8-default-rtdb.asia-southeast1.firebasedatabase.app/"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Initialize Realtime Database and get a reference tco the service
    const database = getDatabase(app);

    const db = getDatabase();
    const dataRef = ref(db, "vote");

    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      // Convert data to desired format
      const convertedData = Object.keys(data)
        .filter(key => key === id)
        .map(key => {
          const item = data[key];
          console.log("options", item.tags[7]);
          return {
            id: key,
            title: item.tags[5],
            info: item.tags[6],
            startdate: item.tags[3],
            enddate: item.tags[4],
            multipleChoiceAllowed: item.tags[1],
            options: item.tags[7]

          };
        });
      setInitSearchData(convertedData);
      setVoteId(convertedData[0].id);
      setMultipleChoice(convertedData[0].multipleChoiceAllowed);
      setStartDate(convertedData[0].startdate);
      setEndDate(convertedData[0].enddate);
      setOptions(convertedData[0].options);
      console.log("options", options);
      console.log("Data from Firebase:", data);
    });
  }


  async function handleVoteClick() {
    const relay = await Relay.connect('ws://47.129.0.53:8080');
    console.log(`Connected to ${relay.url}`);

    // let's publish a new event while simultaneously monitoring the relay for it
    let sk = generateSecretKey()
    let pk = getPublicKey(sk)


    let eventTemplate = {
      kind: 309,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        [
          "e",
          "47c78ca5e4612cc13aa14c792a96967a4975bfa8ed5e6fcec8b8366f65c4b7b9"
        ],
        [
          "poll_r",
          "0",
          "2"
        ]
      ],
      content: "",
    }


    // this assigns the pubkey, calculates the event id and signs the event in a single step
    const signedEvent = finalizeEvent(eventTemplate, sk)

    console.log("signedEvent", signedEvent)
    await relay.publish(signedEvent)
    console.log("write result")
    relay.close()
  }



  return (<div>
    <head>
      <title>DAO Voting Interface</title>
      <script src="https://unpkg.com/react/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.js"></script>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <style>
        {`
              body {
                font-family: 'Inter', sans-serif;
              }
            `}
      </style>
    </head>

    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 p-4 bg-white shadow rounded">
        <Link to="/">  <a>
          <img src={logopng} alt="Logo" className="h-8" ></img>
        </a></Link>
        <button className="bg-gray-500 rounded-full hover:bg-gray-700 text-white font-bold py-2 px-4 ml-8">
                            {addr.length > 10 ? `${addr.substring(0, 5)}...${addr.substring(addr.length - 5)}` : addr}
                        </button>
      </header>
      <main className="flex gap-4">
        <section className="w-2/3 p-4 bg-white shadow rounded">
          <h1 className="text-xl font-bold mb-4">{InitSearchData[0].title}</h1>
          <article className="text-gray-700">
            <p>
              {InitSearchData[0].info}
            </p>
          </article>
        </section>
        <aside className="w-1/3 space-y-4">
          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-2">Information</h2>
            <hr className="mb-4" />
            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span className="font-bold">VoteId</span>
                <span>{voteId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Multiple Choice</span>
                <span>{multipleChoice}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Start date</span>
                <span>{startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">End date</span>
                <span>{endDate}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-2">Current results</h2>
            <hr className="mb-4" />
            <div className="text-sm">
              {/* <div className="mb-2">
                <div className="flex items-center">

                  <div>
                    <span className="font-bold">For</span>
                    <span>13M ARB</span>
                  </div>

                </div>

                <div className="flex items-center">
                  <div className="flex items-center flex-grow bg-gray-300 h-2 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '96.81%' }}></div>
                  </div>
                  <div className="ml-2">96.81%</div>

                </div>


              </div> */}

              {options.map((option, index) => (
                <div className="flex justify-between mb-4" key={index}>

                  <label htmlFor={`option${index + 1}`} className="cursor-pointer">
                    {option}
                  </label>
                  <span>100k</span>

                </div>
              ))}




            </div>
          </div>


          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-2">Cast your vote</h2>
            <hr className="mb-4" />
            <div className="text-sm">
              {options.map((option, index) => (
                <div className="flex items-center mb-4" key={index}>
                  <input
                    type={choiceValue === 'multi' ? 'checkbox' : 'radio'} // 根据choiceValue的值选择单选或多选
                    id={`option${index + 1}`}
                    name="voteOption"
                    className="mr-2"
                  />
                  <label htmlFor={`option${index + 1}`} className="cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleVoteClick}
              >
                Vote
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>

  </div>)


}


export default Detial;
