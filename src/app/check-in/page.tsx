
"use client";

import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import withAuth from '../../components/withAuth';

const CheckIn = () => {
  const [id, setId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Checked in ID: ${id}`);
    setId('');
  };

  return (
    <>
      <Head>
        <title>Check In</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div className="flex flex-grow justify-center items-center">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-5 text-black">Check In</h1>
            <label className="block text-sm font-bold mb-2 text-black">ID Number</label>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 mb-4 w-full text-black placeholder-black"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter ID"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Check In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default withAuth(CheckIn);
