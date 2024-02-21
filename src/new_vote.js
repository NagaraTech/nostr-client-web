
import React, { useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from './logo.png';
// import { faMinus } from './logo.png';
import { Relay, generateSecretKey, getPublicKey } from 'nostr-tools';
import { finalizeEvent } from 'nostr-tools';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase, ref, push, set, onValue } from "firebase/database";




let choiceValue = 'single';

function NewVote() {


    const navigate = useNavigate();
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [multipleChoiceAllowed, setMultipleChoiceAllowed] = React.useState(false);

    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState('');
    const [options, setOptions] = React.useState(['Yes', 'No']);
    const [addr, setAddr] = React.useState('0x1231');



    useEffect(() => {
        let local_sk = localStorage.getItem('sk')

        if (local_sk == null){
            navigate("/login");
        }else{
            const numberArray = local_sk.split(",").map(Number)
            // 确保数组长度为32
            while (numberArray.length < 32) {
                numberArray.push(0); // 填充0
            }
            let sk = numberArray.map(num => num.toString(16).padStart(2, '0')).join('');;
            console.log('sk', sk)
    
            setAddr('0x' + getPublicKey(sk))
        }
    });

    /**
     * firebase part
     */
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




    const handleOptionChange = (e, index) => {
        const updatedOptions = [...options];
        updatedOptions[index] = e.target.value;
        setOptions(updatedOptions);
    };

    const handleAddOption = () => {
        const nextOptionNumber = options.length + 1;
        setOptions([...options, `Option ${nextOptionNumber}`]);
    };

    const handleRemoveOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };


    const handleStartTimeChange = (e) => {

        // setStartTime(new Date(e.target.value).getTime());
        setStartTime(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
        // setStartTime(new Date(e.target.value).getTime());
    };



    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleMultipleChoiceAllowedChange = () => {


        if (!multipleChoiceAllowed) {
            setMultipleChoiceAllowed(!multipleChoiceAllowed);
            choiceValue = 'multi'
        } else {
            setMultipleChoiceAllowed(!multipleChoiceAllowed);
            choiceValue = 'single'
        }

        console.log(choiceValue);


    };

    const handlePublish = () => {
        // 访问收集的数据
        console.log('Title:', title);
        console.log('Content:', content);
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);
        console.log('Options:', options);
        console.log('Multiple Choice Allowed:', multipleChoiceAllowed);

        var jsonData = {
            title: title,
            content: content,
            startTime: startTime,
            endTime: endTime,
            options: options,
            multipleChoiceAllowed: multipleChoiceAllowed
        };



        connectAndSubscribe(jsonData);


        // 执行其他操作...

        // 可以使用 react-router-dom 进行路由导航
    };


    async function connectAndSubscribe(jsonData) {



        console.log("jsonData", jsonData)


        const db = getDatabase();
        const dataRef = ref(db, "vote");

        const newData = {
            kind: 301,
            created_at: Math.floor(Date.now() / 1000),
            tags: ["poll", choiceValue, "0", jsonData.startTime, jsonData.endTime, jsonData.title, jsonData.content, jsonData.options],
            content: "",
        }

        console.log("new Datais ", newData);

        try {
            const newChildRef = push(dataRef);
            await set(newChildRef, newData);
            console.log("Data added with key: ", newChildRef.key);
        } catch (error) {
            console.error("Error adding data: ", error);
        }

        console.log("Storage in firebase", jsonData)

        onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            console.log("Data from Firebase:", data);
        });

        //



        const relay = await Relay.connect('wss://zsocialrelay1.nagara.dev');
        console.log(`Connected to ${relay.url}`);

        // let's publish a new event while simultaneously monitoring the relay for it
        let local_sk = localStorage.getItem('sk')

        const numberArray = local_sk.split(",").map(Number)
        // 确保数组长度为32
        while (numberArray.length < 32) {
            numberArray.push(0); // 填充0
        }
        let sk = numberArray.map(num => num.toString(16).padStart(2, '0')).join('');;
        console.log('sk', sk)
        // pk = getPublicKey(sk)

        let tags = ["poll", choiceValue, "0", jsonData.startTime, jsonData.endTime, jsonData.title, jsonData.content]
        for (var op in jsonData.options) {
            tags.push(jsonData.options[op])
        }

        console.log('tags', tags);

        let eventTemplate = {
            kind: 301,
            created_at: Math.floor(Date.now() / 1000),
            tags: [tags],
            content: "",
        }



        // this assigns the pubkey, calculates the event id and signs the event in a single step
        const signedEvent = finalizeEvent(eventTemplate, sk)

        console.log("signedEvent", signedEvent)
        let result = await relay.publish(signedEvent)
        console.log("write result", result)
        relay.close()


    }

    return (

        <div>
            <head>
                <title>DAO Voting Interface</title>
                <script src="https://unpkg.com/react/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
                <script src="https://unpkg.com/@babel/standalone/babel.js"></script>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
            </head>


            <div className="container mx-auto px-4 py-8">
                <header className="flex justify-between items-center mb-8 p-4 bg-white shadow rounded">

                    <Link to="/">  <a>
                        <img src="./logo.png" alt="Logo" className="h-8" ></img>
                    </a></Link>
                    <div className="flex justify-end">


                        {/* <button> <Link to="/newvote"> New vote </Link></button> */}


                        <button className="bg-gray-500 rounded-full hover:bg-gray-700 text-white font-bold py-2 px-4 ml-8">
                            {addr.length > 10 ? `${addr.substring(0, 5)}...${addr.substring(addr.length - 5)}` : addr}
                        </button>

                    </div>

                </header>

                <div class="mx-auto w-3/5">

                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                title
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="title"
                                type="text"
                                placeholder="Please input title on here"
                                value={title}
                                onChange={handleTitleChange}
                            />

                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                Content
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="content"
                                placeholder="Please Content on here"
                                value={content}
                                onChange={handleContentChange}
                            />             </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Time
                            </label>
                            <div className="flex gap-4">
                                <input
                                    className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={handleStartTimeChange}
                                    placeholder="start time"
                                />
                                <input
                                    className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={handleEndTimeChange}
                                    placeholder="End time"
                                />

                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Relay
                            </label>
                            <div className="relative">
                                <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                    <option>All</option>
                                    <option>wss://hetu.relay.io</option>
                                    <option>wss://udaya.relay.io</option>
                                    <option>wss://nostr.relay.io</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <i className="fas fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>





                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Option
                            </label>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700 text-sm">Multiple choice allowed</span>
                                <label className="switch">
                                    <input
                                        checked={!!multipleChoiceAllowed} // 使用双重否定运算符将值转换为布尔类型
                                        onChange={handleMultipleChoiceAllowedChange}
                                        type="checkbox"
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-4">
                                {options.map((option, index) => (
                                    <div key={index} className="relative">

                                        <input
                                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            placeholder={option}
                                            value={option}
                                            onChange={(e) => handleOptionChange(e, index)}
                                        />
                                        <span
                                            className="absolute top-0 right-0 cursor-pointer text-red-500"
                                            onClick={() => handleRemoveOption(index)}
                                        >
                                            <image src='./logo.png' />
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="bg-transparent hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                                type="button"
                                onClick={handleAddOption}
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>

                        <div className="flex items-center justify-center">
                            <button onClick={handlePublish} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">


                                <Link to='/'> submmit </Link>
                            </button>
                        </div>
                    </div>
                </div>


            </div>


        </div>




    )

}

export default NewVote;

