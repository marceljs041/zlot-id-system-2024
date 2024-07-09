"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      setError('Incorrect username or password');
      return;
    }

    const userDoc = querySnapshot.docs[0].data();
    if (userDoc.password === password) {
      localStorage.setItem('authToken', 'loggedIn');
      router.push('/main-menu');
    } else {
      setError('Incorrect username or password');
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <h1 className="font-bold text-center text-2xl mb-5 text-black">Login</h1>
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <form onSubmit={handleSubmit} className="px-5 py-7">
              <label className="font-semibold text-sm text-gray-600 pb-1 block">Username</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full text-black placeholder-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
              <input
                type="password"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full text-black placeholder-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              {error && <p className="text-red-500 text-sm mb-5">{error}</p>}
              <button
                type="submit"
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Login</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline-block h-4 w-4"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
