import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {Relay, generateSecretKey, getPublicKey} from 'nostr-tools'
import {finalizeEvent, verifyEvent} from 'nostr-tools'
import Pagination from '@mui/material/Pagination';
// import Login from './login';
import usePagination from "./Pagination";
import "./LoadingPage.css";


function Vote() {

    const [searchText, setSearchText] = React.useState("");
    const [InitSearchData, setInitSearchData] = useState([]);
    const [searchData, setSearchData] = useState({
        id: 'null',
        title: 'null',
        info: 'null'
    });
    const [addr, setAddr] = React.useState('0x1231');
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const handleButtonClick = () => {
        setShowDropdown(!showDropdown);
    };

    const navigate = useNavigate();

    const handleLogoutClick = () => {
        navigate("/login");
    };

    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);

    let [page, setPage] = useState(1);
    const PER_PAGE = 5;

    const count = Math.ceil(InitSearchData.length / PER_PAGE);
    const _DATA = usePagination(InitSearchData, PER_PAGE);
    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    useEffect(() => {

        let local_sk = localStorage.getItem('sk')

        if (local_sk == null) {
            navigate("/login");
        } else {
            const numberArray = local_sk.split(",").map(Number)
            // make sure array equal to 32
            while (numberArray.length < 32) {
                numberArray.push(0); // 0
            }
            let sk = numberArray.map(num => num.toString(16).padStart(2, '0')).join('');
            ;
            console.log('sk', sk)

            setAddr('0x' + getPublicKey(sk))
        }

        const intervalId = setInterval(() => {
            InitEvent();
        }, 4000);

        // clean timer
        return () => {
            clearInterval(intervalId);
        };


    }, []);


    async function InitEvent() {


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
            setIsLoading(false)

        };


        socket.onclose = () => {
            console.log('Socket connection closed');

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

    }


    return (<div>
        <head>
            <title>DAO Voting Interface</title>
            <script src="https://unpkg.com/react/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet"/>
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


        <div>
            {isLoading ? (
                <div className="loading-page-container">
                    <div className="initial-animation"></div>
                    <div className="loading-page">
                        <div className="circle1"></div>
                        <div className="circle2"></div>
                        <div className="circle3"></div>
                        <div className="circle4"></div>
                        <div className="circle5"></div>
                        <div className="circle6"></div>
                        <div className="circle7"></div>
                        <div className="circle8"></div>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-8">


                    <header className="flex justify-between items-center mb-8 p-4 bg-white shadow rounded">

                        <Link to="/"> <a>
                            <img src="./logo.png" alt="Logo" className="h-8"></img>
                        </a></Link>

                        <div className="flex justify-end">


                            <button><Link to="/newvote"> New vote </Link></button>


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
                                    <div
                                        className="absolute mt-2 w-48 bg-gray-500 rounded-md shadow-lg overflow-hidden">

                                        <ul className="py-2">
                                            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                                                onClick={handleLogoutClick}
                                            >Logout
                                            </li>

                                        </ul>
                                    </div>
                                )}
                            </div>


                        </div>

                    </header>


                    <div class="mx-auto w-3/5">

                        <div className="p-4">
                            <div className="bg-white p-4 rounded-md shadow-sm relative">
                                <h2 className="text-xl font-semibold mb-4">Search</h2>
                                <p className="text-gray-600 mb-4">Paste a nostr vote id.</p>
                                <p className="text-gray-600 mb-4">vote id are supported, write a filter by vote id.</p>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center flex-grow">
                                        <i className="fas fa-search search-icon"></i>
                                        <input
                                            type="text"
                                            placeholder="Search Vote ID"
                                            className="border border-gray-300 p-2 rounded-md search-input ml-2 mr-2 w-full" // 添加 w-full 类名
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                        onClick={() => SearchEvent(searchText)}
                                    >
                                        Search
                                    </button>
                                </div>
                                <div>
                                    {searchData.id != 'null' ? (
                                        <Link to={`/detail/${searchData.id}`}
                                              className="bg-white p-4 rounded-md shadow-sm mb-8">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-500">
                                                    {console.log(searchData)}
                                                    {searchData.id.length > 10 ? `${searchData.id.substring(0, 5)}...${searchData.id.substring(searchData.id.length - 5)}` : searchData.id}
                                                </span>


                                                <span
                                                    className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                                            </div>
                                            <h3 className="text-lg font-semibold">{searchData.title}</h3>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{searchData.info}</p>
                                        </Link>
                                    ) : (

                                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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

                                {_DATA.currentData().map((item) => (
                                    <Link to={`/detail/${item[0]}`}>
                                        <div className="bg-white p-4 rounded-md shadow-sm mb-4" key={item[0]}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span
                                                    className="text-sm text-gray-500">      {item[0].length > 10 ? `${item[0].substring(0, 5)}...${item[0].substring(item[0].length - 5)}` : item[0]}  </span>
                                                <span
                                                    className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                                            </div>
                                            <h3 className="text-lg font-semibold">{item[1]}</h3>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item[2]}</p>
                                        </div>
                                    </Link>

                                ))}


                                <Pagination
                                    count={count}
                                    size="large"
                                    page={page}
                                    variant="outlined"
                                    shape="rounded"
                                    onChange={handleChange}
                                >
                                </Pagination>


                            </div>
                        </div>
                    </div>


                </div>
            )}

        </div>


    </div>)

}


export default Vote;


