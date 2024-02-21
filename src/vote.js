import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Relay, generateSecretKey, getPublicKey } from 'nostr-tools'
import { finalizeEvent, verifyEvent } from 'nostr-tools'

import Login from './login';
import { initializeApp } from "firebase/app";

import { getDatabase, ref, push, set, onValue } from "firebase/database";


function Vote() {

    const [searchText, setSearchText] = React.useState("");
    const [InitSearchData, setInitSearchData] = useState([]);
    const [searchData, setSearchData] = useState({
        id: 'null',
        title: 'null',
        info: 'null'
    });
    const [addr, setAddr] = React.useState('0x1231');

    const navigate = useNavigate();

    useEffect(() => {

        let local_sk = localStorage.getItem('sk')

        if (local_sk == null) {
            navigate("/login");
        } else {
            const numberArray = local_sk.split(",").map(Number)
            // 确保数组长度为32
            while (numberArray.length < 32) {
                numberArray.push(0); // 填充0
            }
            let sk = numberArray.map(num => num.toString(16).padStart(2, '0')).join('');;
            console.log('sk', sk)

            setAddr('0x' + getPublicKey(sk))
        }

        InitEvent();



    }, []);



    async function InitEvent() {




        // const firebaseConfig = {
        //     apiKey: "AIzaSyCgRzMHIfhPZnIXedgNuqqoyQz5sausEu8",
        //     authDomain: "vote-2b9d8.firebaseapp.com",
        //     projectId: "vote-2b9d8",
        //     storageBucket: "vote-2b9d8.appspot.com",
        //     messagingSenderId: "1050103509183",
        //     appId: "1:1050103509183:web:15565360fa1d58fe96560a",
        //     measurementId: "G-NZXRF34DPT",
        //     databaseURL: "https://vote-2b9d8-default-rtdb.asia-southeast1.firebasedatabase.app/"
        // };

        // // Initialize Firebase
        // const app = initializeApp(firebaseConfig);
        // // Initialize Realtime Database and get a reference tco the service
        // const database = getDatabase(app);

        // const db = getDatabase();
        // const dataRef = ref(db, "vote");

        // onValue(dataRef, (snapshot) => {
        //     const data = snapshot.val();
        //     // Convert data to desired format
        //     const convertedData = Object.keys(data).map((key) => {
        //         const item = data[key];
        //         return {
        //             id: key,
        //             title: item.tags[5],
        //             info: item.tags[6]
        //         };
        //     });

        //     console.log(convertedData);
        //     // setInitSearchData(convertedData);
        //     console.log("Data from Firebase:", data);
        // });



        const socket = new WebSocket('wss://zsocialrelay1.nagara.dev');
        // RelayServer.send('["QUERY_SID"]'); 
        socket.onopen = () => {
            const message = JSON.stringify(["QUERYPOLLLIST", ""]);
            socket.send(message);
        };



        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setInitSearchData(data);
            console.log('Received data:', data);

        };


        socket.onclose = () => {
            console.log('Socket connection closed');
            // 在这里处理连接关闭的逻辑
        };
    }


    async function SearchEvent(searchText) {

        var lag = 0;

        for (var i in InitSearchData) {

            console.log("InitSearchData[i][0]", InitSearchData[i][0])
            console.log("searchText", searchText)
            if (InitSearchData[i][0] == searchText) {
                setSearchData({
                    id: InitSearchData[i][0],
                    title: InitSearchData[i][1],
                    info: InitSearchData[i][2]
                })
                lag = 1;

                // console.log("searchData",searchData, searchData.length)
            }
        }

        if (lag == 0) {
            setSearchData({
                id: 'null',
                title: 'null',
                info: 'null'
            })

            console.log("searchData", searchData)
        }







        // const db = getDatabase();
        // const dataRef = ref(db, "vote");

        // onValue(dataRef, (snapshot) => {
        //     const data = snapshot.val();
        //     // Convert data to desired format
        //     const convertedData = Object.keys(data)
        //         .filter(key => key === searchText)
        //         .map(key => {
        //             const item = data[key];
        //             console.log("options", item.tags[7]);
        //             return {
        //                 id: key,
        //                 title: item.tags[5],
        //                 info: item.tags[6],
        //             };
        //         });

        //     console.log('searchText is', searchText);
        //     setSearchData(convertedData);
        //     console.log('convertedData is', convertedData);


        // });


        // const socket = new WebSocket('ws://47.129.0.53:8080');
        // console.log('searchText is', searchText);
        // // RelayServer.send('["QUERY_SID"]'); 
        // socket.onopen = () => {
        //     const message = JSON.stringify(["QUERY", searchText]);
        //     socket.send(message);
        // };

        // socket.onmessage = (event) => {
        //     const data = JSON.parse(event.data);
        //     setSearchData(data);
        //     console.log('Received data:', data);
        //     // 在这里处理接收到的数据
        // };

        // socket.onclose = () => {
        //     console.log('Socket connection closed');
        //     // 在这里处理连接关闭的逻辑
        // };


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




                    <button className="bg-gray-500 rounded-full hover:bg-gray-700 text-white font-bold py-2 px-4 ml-8">
                        {addr.length > 10 ? `${addr.substring(0, 5)}...${addr.substring(addr.length - 5)}` : addr}
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
                            <div className="flex items-center">
                                <i className="fas fa-search search-icon"></i>
                                <input
                                    type="text"
                                    placeholder="Event ID"
                                    className="border border-gray-300 p-2 rounded-md search-input ml-2"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
                                onClick={() => SearchEvent(searchText)}
                            >
                                Search
                            </button>
                        </div>
                        <div >
                            {searchData.id != 'null' ? (
                                <Link to={`/detail/${searchData.id}`} className="bg-white p-4 rounded-md shadow-sm mb-8" >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-500">
                                            {console.log(searchData)}
                                            {searchData.id.length > 10 ? `${searchData.id.substring(0, 5)}...${searchData.id.substring(searchData.id.length - 5)}` : searchData.id}
                                        </span>


                                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                                    </div>
                                    <h3 className="text-lg font-semibold">{searchData.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{searchData.info}</p>
                                </Link>
                            ) : (

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img
                                        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/bqaeh7vhobd/feedback.svg"
                                        alt="Placeholder image representing no data available"
                                    />
                                </div>

                            )}
                        </div>
                    </div>



                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Proposals</h2>

                        {InitSearchData.map((item) => (
                            <Link to={`/detail/${item[0]}`}>
                                <div className="bg-white p-4 rounded-md shadow-sm mb-4" key={item[0]}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-500">      {item[0].length > 10 ? `${item[0].substring(0, 5)}...${item[0].substring(item[0].length - 5)}` : item[0]}  </span>
                                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                                    </div>
                                    <h3 className="text-lg font-semibold">{item[1]}</h3>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item[2]}</p>
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


