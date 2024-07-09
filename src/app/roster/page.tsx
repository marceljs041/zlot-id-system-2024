"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';

const Roster = () => {
  const [roster, setRoster] = useState([]);
  const [filteredRoster, setFilteredRoster] = useState([]);
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showOnsiteModal, setShowOnsiteModal] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [newOnsiteStatus, setNewOnsiteStatus] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRoster = async () => {
      const querySnapshot = await getDocs(collection(db, "IDs"));
      const rosterList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setRoster(rosterList);
      setFilteredRoster(rosterList);
    };

    fetchRoster();
  }, []);

  useEffect(() => {
    setFilteredRoster(
      roster.filter(
        (person) =>
          person.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.Name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, roster]);

  const toggleSelection = (id) => {
    setSelectedPersons((prev) =>
      prev.includes(id) ? prev.filter((personId) => personId !== id) : [...prev, id]
    );
  };

  const handleUpdateLocation = async () => {
    const batch = writeBatch(db);
    selectedPersons.forEach((id) => {
      const personRef = doc(db, "IDs", id);
      batch.update(personRef, { 'Current Location': newLocation });
    });
    await batch.commit();

    const querySnapshot = await getDocs(collection(db, "IDs"));
    const rosterList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setRoster(rosterList);
    setShowLocationModal(false);
    setSelectedPersons([]);
    setNewLocation("");
  };

  const handleUpdateOnsiteStatus = async () => {
    const batch = writeBatch(db);
    selectedPersons.forEach((id) => {
      const personRef = doc(db, "IDs", id);
      batch.update(personRef, { onsite: newOnsiteStatus });
    });
    await batch.commit();

    const querySnapshot = await getDocs(collection(db, "IDs"));
    const rosterList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setRoster(rosterList);
    setShowOnsiteModal(false);
    setSelectedPersons([]);
    setNewOnsiteStatus(true);
  };

  return (
    <>
      <Head>
        <title>Roster</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div className="flex flex-col items-center mt-8 px-4">
          <h1 className="text-5xl font-bold mb-5 text-black">Roster</h1>
          <div className="flex justify-between w-full mb-4">
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mr-2"
                onClick={() => setShowLocationModal(true)}
                disabled={selectedPersons.length === 0}
              >
                Change Location
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                onClick={() => setShowOnsiteModal(true)}
                disabled={selectedPersons.length === 0}
              >
                Change Onsite Status
              </button>
            </div>
            <div className="text-black font-bold">
              Selected: {selectedPersons.length}
            </div>
          </div>
          <input
            type="text"
            className="border rounded-lg px-3 py-2 mb-4 w-full text-black placeholder-black"
            placeholder="Search by ID or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <thead>
              <tr>
                <th className="px-4 py-2 text-black">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPersons(filteredRoster.map(person => person.id));
                      } else {
                        setSelectedPersons([]);
                      }
                    }}
                    checked={selectedPersons.length === filteredRoster.length}
                  />
                </th>
                <th className="px-4 py-2 text-black">ID</th>
                <th className="px-4 py-2 text-black">Name</th>
                <th className="px-4 py-2 text-black">Stopien</th>
                <th className="px-4 py-2 text-black">Rodzaj</th>
                <th className="px-4 py-2 text-black">Zlot</th>
                <th className="px-4 py-2 text-black">Hufiec</th>
                <th className="px-4 py-2 text-black">Podoboz</th>
                <th className="px-4 py-2 text-black">Current Location</th>
                <th className="px-4 py-2 text-black">Onsite</th>
                <th className="px-4 py-2 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoster.map(person => (
                <tr key={person.id}>
                  <td className="border px-4 py-2 text-black">
                    <input
                      type="checkbox"
                      checked={selectedPersons.includes(person.id)}
                      onChange={() => toggleSelection(person.id)}
                    />
                  </td>
                  <td className="border px-4 py-2 text-black">{person.id}</td>
                  <td className="border px-4 py-2 text-black">{person.Name}</td>
                  <td className="border px-4 py-2 text-black">{person.Stopien}</td>
                  <td className="border px-4 py-2 text-black">{person.Rodzaj}</td>
                  <td className="border px-4 py-2 text-black">{person.Zlot}</td>
                  <td className="border px-4 py-2 text-black">{person.Hufiec}</td>
                  <td className="border px-4 py-2 text-black">{person.Podoboz}</td>
                  <td className="border px-4 py-2 text-black">{person['Current Location']}</td>
                  <td className={`border px-4 py-2 ${person.onsite ? 'bg-green-100' : 'bg-red-100'} text-black`}>{person.onsite ? 'Yes' : 'No'}</td>
                  <td className="border px-4 py-2">
                    <button className="text-blue-500 hover:underline" onClick={() => setSelectedPersons([person.id])}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Change Location</h2>
            <label className="block text-sm font-bold mb-2 text-black">New Location</label>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 mb-4 w-full text-black placeholder-black"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter New Location"
              required
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mr-2"
              onClick={handleUpdateLocation}
            >
              Update Location
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => setShowLocationModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showOnsiteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Change Onsite Status</h2>
            <label className="block text-sm font-bold mb-2 text-black">New Onsite Status</label>
            <select
              className="border rounded-lg px-3 py-2 mb-4 w-full text-black"
              value={newOnsiteStatus ? 'true' : 'false'}
              onChange={(e) => setNewOnsiteStatus(e.target.value === 'true')}
            >
              <option value="true">Onsite</option>
              <option value="false">Offsite</option>
            </select>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mr-2"
              onClick={handleUpdateOnsiteStatus}
            >
              Update Onsite Status
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => setShowOnsiteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Roster;
