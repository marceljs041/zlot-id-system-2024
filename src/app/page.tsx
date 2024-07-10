"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { auth, provider, signInWithPopup, signOut, db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const LoginPage = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const q = query(collection(db, 'allowedUsers'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        localStorage.setItem('authToken', 'loggedIn');
        router.push('/main-menu');
      } else {
        await signOut(auth);
        setError('You are not authorized to access this application.');
      }
    } catch (error) {
      setError('Failed to log in with Google.');
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <h1 className="font-bold text-center text-2xl mb-5 text-black">Zlot ID Login</h1>
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7">
              <button
                onClick={handleGoogleLogin}
                className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Login with Google</span>
              </button>
              {error && <p className="text-red-500 text-sm mt-5">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
