
import React from 'react';
import { Link } from 'react-router-dom';

function Detial() {

    return( <div>
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
                        <img src="./logo.png" alt="Logo" className="h-8" ></img>
                    </a></Link>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Connect wallet
          </button>
        </header>
        <main className="flex gap-4">
          <section className="w-2/3 p-4 bg-white shadow rounded">
            <h1 className="text-xl font-bold mb-4">[Constitutional] Changes to the Constitution and the Security Council Election Process</h1>
            <article className="text-gray-700">
              <h2 className="font-bold mb-2">Abstract</h2>
              <p>This Constitutional AIP proposes improvements to the ArbitrumDAO Constitution and the Security Council election process, which include:</p>
              <ul className="list-disc ml-5 my-2">
                <li>Candidates are given a week to apply for a Security Council position before the nominee selection stage takes place.</li>
                <li>Candidates need to sign a transaction from their EOA (Externally Owned Account) to apply for a Security Council position.</li>
                <li>The ArbitrumDAO Constitution is updated to reflect these changes as well as correct previous mistakes in wording with regard to timing and quorum.</li>
              </ul>
              <h2 className="font-bold mb-2">Motivation</h2>
              <p>This AIP aims to improve the election process ensuring that candidates are not overlooked during the nominee selection stage and that candidates stand an equal chance of being nominated t</p>
            </article>
          </section>
          <aside className="w-1/3 space-y-4">
            <div className="p-4 bg-white shadow rounded">
              <h2 className="text-xl font-bold mb-2">Information</h2>
              <hr className="mb-4" />
              <div className="text-sm">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">VoteId</span>
                  <span>7af75a57a5d</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Voting system</span>
                  <span>Single choice voting</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Start date</span>
                  <span>Jan 30, 2024, 1:17 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">End date</span>
                  <span>Feb 6, 2024, 1:17 AM</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <h2 className="text-xl font-bold mb-2">Current results</h2>
              <hr className="mb-4" />
              <div className="text-sm">
                <div className="mb-2">
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


                </div>


                <div className="mb-2">
                  <div className="flex items-center">

                    <div className="ml-2">
                      <span className="font-bold">Abstain</span>
                      <span className="ml-2">326K ARB</span>
                    </div>
                  </div>



                  <div className="flex items-center">
                    <div className="flex items-center flex-grow bg-gray-300 h-2 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '2.43%' }}></div>
                    </div>
                    <div className="ml-2">2.43%</div>

                  </div>

                </div>


                <div>
                  <div className="flex items-center">

                    <div className="ml-2">
                      <span className="font-bold">Against</span>
                      <span className="ml-2">102K ARB</span>
                    </div>
                  </div>



                  <div className="flex items-center">
                    <div className="flex items-center flex-grow bg-gray-300 h-2 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '0.76%' }}></div>
                    </div>
                    <div className="ml-2">0.76%</div>

                  </div>

                </div>
              </div>
            </div>


            <div className="p-4 bg-white shadow rounded">
              <h2 className="text-xl font-bold mb-2">Cast your vote</h2>
              <hr className="mb-4" />
              <div className="text-sm">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="option1"
                    name="voteOption"
                    className="mr-2"
                  />
                  <label htmlFor="option1" className="cursor-pointer">
                    For
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="option2"
                    name="voteOption"
                    className="mr-2"
                  />
                  <label htmlFor="option2" className="cursor-pointer">
                    Against
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="option3"
                    name="voteOption"
                    className="mr-2"
                  />
                  <label htmlFor="option3" className="cursor-pointer">
                    Abstain
                  </label>
                </div>
                <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
