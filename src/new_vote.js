
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { Relay, generateSecretKey, getPublicKey } from 'nostr-tools'
import { finalizeEvent, verifyEvent } from 'nostr-tools'

function NewVote() {

    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [multipleChoiceAllowed, setMultipleChoiceAllowed] = React.useState(false);
    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState('');
    const [options, setOptions] = React.useState(['Option 1', 'Option 2', 'Option 3']);


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
        setStartTime(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleMultipleChoiceAllowedChange = (e) => {
        setMultipleChoiceAllowed(e.target.checked);
    };

    const handlePublish = () => {
        // 访问收集的数据
        console.log('Title:', title);
        console.log('Content:', content);
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);
        console.log('Options:', options);
        console.log('Multiple Choice Allowed:', multipleChoiceAllowed);

        var data = {
            title: title,
            content: content,
            startTime: startTime,
            endTime: endTime,
            options: options,
            multipleChoiceAllowed: multipleChoiceAllowed
        };

        var jsonData = JSON.stringify(data);

        connectAndSubscribe( jsonData);


        // 执行其他操作...

        // 可以使用 react-router-dom 进行路由导航
    };


    async function connectAndSubscribe(jsonData) {
        const relay = await Relay.connect('ws://127.0.0.1:8080/');
        console.log(`Connected to ${relay.url}`);

        // let's publish a new event while simultaneously monitoring the relay for it
        let sk = generateSecretKey()
        let pk = getPublicKey(sk)




        let eventTemplate = {
            kind: 301,
            created_at: Math.floor(Date.now() / 1000),
            tags: [["poll", "single", "0", "I'm a title!", "This a demo survey!", "Option 1", "Option 2", "Option 3"]],
            content: jsonData,
        }
        // this assigns the pubkey, calculates the event id and signs the event in a single step
        const signedEvent = finalizeEvent(eventTemplate, sk)

        console.log("signedEvent",signedEvent)
        await relay.publish(signedEvent)

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


                        <button> <Link to="/newvote"> New vote </Link></button>


                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-8">
                            Connect wallet
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
                                    <input checked={multipleChoiceAllowed}
                                        onChange={handleMultipleChoiceAllowedChange} type="checkbox" />
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
                                            <FontAwesomeIcon icon={faMinus} />
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


                                <Link to="/detail"> publish </Link>
                            </button>
                        </div>
                    </div>
                </div>


            </div>


        </div>




    )

}

export default NewVote;

