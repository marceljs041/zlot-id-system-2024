// src/components/Navbar.tsx

"use client";

import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  return (
    <nav className="bg-blue-500 text-white p-4">
      <ul className="flex space-x-8">
        <li>
          <a href="/main-menu" className="hover:underline">Home</a>
        </li>
        <li>
          <a href="/check-in" className="hover:underline">Check In</a>
        </li>
        <li>
          <a href="/reports" className="hover:underline">Reports</a>
        </li>
        <li>
          <a href="/roster" className="hover:underline">Roster</a>
        </li>
        <li>
          <button onClick={handleLogout} className="hover:underline">Log Out</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
