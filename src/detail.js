
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import logopng from './logo.png'
import { Relay, generateSecretKey, getPublicKey } from 'nostr-tools';
import { finalizeEvent } from 'nostr-tools';

import { getDatabase, ref, push, set, onValue } from "firebase/database";
import CopyToClipboard from "react-copy-to-clipboard";





function Detial() {

  const { id } = useParams();

  const navigate = useNavigate();

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
  const [optionsNum, setOptionsNum] = useState([0, 0, 0]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [choiceValue, setChoiceValue] = useState('single');
  const [showDropdown, setShowDropdown] = useState(false);
  const [voted, setVoted] = useState(false);

  const [showCopiedMessage, setShowCopiedMessage] = useState(false);


  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogoutClick = () => {
    navigate("/login");
};


  const copiedMessageStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#f3f4f6",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    color: "#1f2937",
  };

  const handleCopy = () => {

    setShowCopiedMessage(true);
    console.log("VoteId copied successfully!");
     setTimeout(() => {
      setShowCopiedMessage(false);
    }, 500);
  };


  useEffect(() => {




    let local_sk = localStorage.getItem('sk')

    if (local_sk == null) {
      navigate("/login");
    } else {
      const numberArray = local_sk.split(",").map(Number)

      while (numberArray.length < 32) {
        numberArray.push(0); 
      }
      let sk = numberArray.map(num => num.toString(16).padStart(2, '0')).join('');;


      setAddr('0x' + getPublicKey(sk))
    }



    InitMetaData()


  }, []);



  const handleOptionChange = (event) => {
    const index = parseInt(event.target.dataset.index);
    const isChecked = event.target.checked;

    if (choiceValue == 'multi') {
      // multi choice
      if (isChecked) {
        setSelectedOptions((prevSelectedOptions) => [...prevSelectedOptions, index]);
      } else {
        setSelectedOptions((prevSelectedOptions) =>
          prevSelectedOptions.filter((option) => option !== index)
        );
      }
    } else {
      // single choice
      if (isChecked) {
        setSelectedOptions([index]);
      } else {
        setSelectedOptions([]);
      }
    }
  };



  async function InitMetaData() {
    const socket = new WebSocket('wss://zsocialrelay1.nagara.dev');
    // RelayServer.send('["QUERY_SID"]'); 


    let responseCount = 1
    socket.onopen = () => {
      const message = JSON.stringify(["QUERYEVENTMETA", id]);
      socket.send(message);
      socket.send(JSON.stringify(["QUERY", { "id": id }]))
    };

    socket.onmessage = (event) => {
      if (responseCount === 1) {
        const data = JSON.parse(event.data);
        console.log('1 Received data:', data);

        console.log('Received tags:', data.tags[0]);
        setVoteId(id)
        setMultipleChoice(data.tags[0].values[1])
        setStartDate(data.tags[0].values[3])
        setEndDate(data.tags[0].values[4])
        setInitSearchData({
          "id": id,
          "title": data.tags[0].values[5],
          "info": data.tags[0].values[6]
        })
        setOptions(data.tags[0].values.slice(7))
        setChoiceValue(multipleChoice)
        // responseCount++; // 响应计数器加一

        console.log("responseCount", responseCount)
      } else if (responseCount === 2) {
        const secondData = JSON.parse(event.data);
        console.log('2 Received data:', secondData);
        const OptionIndexData = secondData.filter((_, index) => index % 2 === 1);
        console.log("OptionIndexData", OptionIndexData)
        setOptionsNum(OptionIndexData)
      }

      responseCount++; // 响应计数器加一

    };

    // socket.onclose = () => {
    //     console.log('Socket connection closed');
    //     // 在这里处理连接关闭的逻辑
    // };
  }


  async function handleVoteClick() {


    let num = optionsNum;
    for(var i in selectedOptions){
      num[selectedOptions[i]] = Number(num[selectedOptions[i]])  + 1
    }

   


    const relay = await Relay.connect('wss://zsocialrelay1.nagara.dev');
    console.log(`Connected to ${relay.url}`);

    // let's publish a new event while simultaneously monitoring the relay for it
    let local_sk = localStorage.getItem('sk')

    const numberArray = local_sk.split(",").map(Number)

    while (numberArray.length < 32) {
      numberArray.push(0); // 
    }
    let sk = numberArray.map(num => num.toString(16).padStart(2, '0')).join('');;
    console.log('sk', sk)
    // let pk = getPublicKey(sk)


    let eventTemplate = {
      kind: 309,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        [
          "e",
          id,
        ],
        [
          "poll_r"
        ].concat(selectedOptions.map(String))
      ],
      content: "",
    }


    // this assigns the pubkey, calculates the event id and signs the event in a single step
    const signedEvent = finalizeEvent(eventTemplate, sk)

    console.log("signedEvent", signedEvent)
    await relay.publish(signedEvent)
    setVoted(true);
    setOptionsNum(num)
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
      <Link to="/">  <a className='flex justify-between'>
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.9998 8L6 14L12.9998 21" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 14H28.9938C35.8768 14 41.7221 19.6204 41.9904 26.5C42.2739 33.7696 36.2671 40 28.9938 40H11.9984" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        {/* <img src="./logo.png" alt="Logo" className="h-8" ></img> */}
                    </a></Link>
        <div className="relative inline-block">
          <button
            className={`bg-gray-500 rounded-full hover:bg-gray-700 text-white font-bold py-2 px-4 ml-8 ${showDropdown ? "dropdown-open" : ""
              }`}
            onClick={handleButtonClick}
          >
            {addr.length > 10
              ? `${addr.substring(0, 5)}...${addr.substring(addr.length - 5)}`
              : addr}
          </button>

          {showDropdown && (
            <div className="absolute mt-2 w-48 bg-gray-500 rounded-md shadow-lg overflow-hidden">
       
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                onClick={handleLogoutClick}
                >Logout</li>
 
              </ul>
            </div>
          )}
        </div>
      </header>
      <main className="flex gap-4">
        <section className="w-2/3 p-4 bg-white shadow rounded">
          <h1 className="text-xl font-bold mb-4">{InitSearchData.title}</h1>
          <article className="text-gray-700">
            <p>
              {InitSearchData.info}
            </p>
          </article>
        </section>
        <aside className="w-1/3 space-y-4">
          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-2">Information</h2>
            <hr className="mb-4" />
            <div className="text-sm">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
      <span style={{ fontWeight: "bold" }}>VoteId</span>
      <span>
        {voteId.length > 10 ? `${voteId.substring(0, 5)}...${voteId.substring(voteId.length - 5)}` : voteId}
        <CopyToClipboard text={voteId} onCopy={handleCopy}>
          <button style={{ marginLeft: "0.5rem", color: "#0053ba", cursor: "pointer", outline: "none" }}>
            Copy
          </button>
        </CopyToClipboard>
      </span>

      {showCopiedMessage && (
        <div style={copiedMessageStyles}>
          <span>Copy ID</span>
        </div>
      )}
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


              {options.map((option, index) => (
                <div className="flex justify-between mb-4" key={index}>

                  <label htmlFor={`option${index + 1}`} className="cursor-pointer">
                    {option}
                  </label>
                  <span> {optionsNum[index]}</span>

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
                    type={choiceValue == 'multi' ? 'checkbox' : 'radio'} //
                    id={`option${index + 1}`}
                    name="voteOption"
                    className="mr-2"
                    data-index={index} // 
                    onChange={handleOptionChange} // 
                  />
                  <label htmlFor={`option${index + 1}`} className="cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
              <div>
                <button
                  className={`w-full ${voted ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
                    } text-white font-bold py-2 px-4 rounded`}
                  onClick={handleVoteClick}
                  disabled={voted}
                >
                  {voted ? "Already Voted" : "Vote"}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>

  </div>)


}


export default Detial;
