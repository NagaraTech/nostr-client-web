import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Relay, generateSecretKey, getPublicKey } from 'nostr-tools'
import { finalizeEvent, verifyEvent } from 'nostr-tools'

import Login from './login';

function Vote() {

    const [searchText, setSearchText] = React.useState("");
    const [InitSearchData, setInitSearchData] = useState([]);
    const [searchData, setSearchData] = useState([]);



    // const relay = await Relay.connect('wss://relay.example.com')
    useEffect(() => {
        InitEvent();
    }, []);

    async function InitEvent() {
        const socket = new WebSocket('ws://47.129.0.53:8080');
        // RelayServer.send('["QUERY_SID"]'); 
        socket.onopen = () => {
            const message = JSON.stringify(["QUERY_SID"]);
            socket.send(message);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setInitSearchData(data);
            console.log('Received data:', data);
            // 在这里处理接收到的数据
        };

        socket.onclose = () => {
            console.log('Socket connection closed');
            // 在这里处理连接关闭的逻辑
        };
    }


    async function SearchEvent() {
        const socket = new WebSocket('ws://47.129.0.53:8080');
        console.log('searchText is',searchText);
        // RelayServer.send('["QUERY_SID"]'); 
        socket.onopen = () => {
            const message = JSON.stringify(["QUERY", searchText]);
            socket.send(message);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setSearchData(data);
            console.log('Received data:', data);
            // 在这里处理接收到的数据
        };

        socket.onclose = () => {
            console.log('Socket connection closed');
            // 在这里处理连接关闭的逻辑
        };


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
            .search-icon {
                position: absolute;
                margin-left: 10px;
                margin-top: 12px;
                color: #9CA3AF;
            }
            .search-input {
                padding-left: 40px;
            }
            .progress-bar {
                background-color: #E5E7EB;
                border-radius: 9999px;
                height: 8px;
                width: 100%;
            }
            .progress {
                background-color: #10B981;
                border-radius: 9999px;
                height: 8px;
                width: 35.7%;
            }

            
            `}
            </style>
        </head>

        <div className="container mx-auto px-4 py-8">



            <header className="flex justify-between items-center mb-8 p-4 bg-white shadow rounded">

                <Link to="/">  <a>
                    <img src="./logo.png" alt="Logo" className="h-8" ></img>
                </a></Link>

                <div className="flex justify-end">


                    <button> <Link to="/newvote"> New vote </Link></button>




                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-8"

                    >

                        <Link to="/login"> Login</Link>

                    </button>



                </div>

            </header>



            <div class="mx-auto w-3/5">

                <div className="p-4">
                    <div className="bg-white p-4 rounded-md shadow-sm relative">
                        <h2 className="text-xl font-semibold mb-4">Search</h2>
                        <p className="text-gray-600 mb-4">Paste a nostr Event ID.</p>
                        <p className="text-gray-600 mb-4">Hashtags are supported, write a # in front of a term to filter by hashtags.</p>
                        <div className="flex items-center mb-4">
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                placeholder="Event ID"
                                className="border border-gray-300 p-2 rounded-md w-full search-input ml-2"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
                                onClick={() => SearchEvent(searchText)}
                            >
                                Search
                            </button>
                        </div>
                        <div className="flex justify-center items-center h-40">
                            {searchData.length > 0 ? (
                                <Link to={`/detail/${searchData[1]}`} className="bg-white p-4 rounded-md shadow-sm mb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-500">{searchData[1]}</span>
                                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                                </div>
                                <h3 className="text-lg font-semibold">{searchData[2]}</h3>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{searchData[3]}</p>
                              </Link>
                            ) : (
                                <img
                                    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/bqaeh7vhobd/feedback.svg"
                                    alt="Placeholder image representing no data available"
                                    className="opacity-50"
                                />
                            )}
                        </div>
                    </div>



                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Proposals</h2>

                        {InitSearchData.map((item) => (
                            <Link to={`/detail/${item.id}`}>
                                <div className="bg-white p-4 rounded-md shadow-sm mb-4" key={item.id}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500">{item.id}</span>
                                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                                </div>
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.info}</p>
                            </div> 
                            </Link>
                           
                        ))}

                        <Link to="/detail">
                            <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500">id</span>
                                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                                </div>
                                <h3 className="text-lg font-semibold">title</h3>

                                <p
                                    className="text-gray-600 text-sm mb-2 line-clamp-2">

                                    info</p>

                                <span className="text-sm text-gray-500">Ends in 5 days</span>
                            </div>

                        </Link>



                        <div className="bg-white p-4 rounded-md shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500">@DK (Premia)</span>
                                <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">Closed</span>
                            </div>
                            <h3 className="text-lg font-semibold">Election of Procurement Committee Members (ADPC)</h3>
                            <p
                                className="text-gray-600 text-sm mb-2 line-clamp-2">This snapshot accompanies the  snapshot accompanies   snapshot accompanies   snapshot accompanies  ongoing vote to establish the Procurement Committee - Go Vote if you haven't already! Proposal Overview: If passed, this...</p>



                            <span className="text-sm text-gray-500">Ended 15 hours ago</span>
                        </div>
                    </div>
                </div>
            </div>



        </div>

        {/* <Link to="/page2">Go to Page 2</Link> */}
    </div>)

}


export default Vote;


