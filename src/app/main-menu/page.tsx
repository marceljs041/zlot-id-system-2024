"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

const MainMenu = () => {
  const [onsiteCount, setOnsiteCount] = useState(0);
  const [offsiteCount, setOffsiteCount] = useState(0);
  const [activeReportsCount, setActiveReportsCount] = useState(0);
  const [activeReports, setActiveReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      const rosterSnapshot = await getDocs(collection(db, "IDs"));
      const rosterList = rosterSnapshot.docs.map(doc => doc.data());

      const onsite = rosterList.filter(person => person.onsite).length;
      const offsite = rosterList.length - onsite;

      setOnsiteCount(onsite);
      setOffsiteCount(offsite);
    };

    const fetchReports = async () => {
      const reportsSnapshot = await getDocs(collection(db, "ERs"));
      const reportsList = reportsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      const activeReports = reportsList.filter(report => report.status);
      setActiveReports(activeReports);
      setActiveReportsCount(activeReports.length);
    };

    fetchCounts();
    fetchReports();
  }, []);

  const handleUpdateReport = async () => {
    const reportRef = doc(db, "ERs", selectedReport.id);
    await updateDoc(reportRef, {
      ...selectedReport,
      lastupdated: serverTimestamp()
    });
    const querySnapshot = await getDocs(collection(db, "ERs"));
    const reportsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setActiveReports(reportsList.filter(report => report.status));
    setActiveReportsCount(reportsList.filter(report => report.status).length);
    setSelectedReport(null);
  };

  return (
    <>
      <Head>
        <title>Main Menu</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div className="flex flex-wrap justify-center mt-8">
          <div className="p-4 w-full sm:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h2 className="text-2xl font-bold text-black">Onsite</h2>
              <p className="text-xl text-black">{onsiteCount}</p>
            </div>
          </div>
          <div className="p-4 w-full sm:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h2 className="text-2xl font-bold text-black">Offsite</h2>
              <p className="text-xl text-black">{offsiteCount}</p>
            </div>
          </div>
          <div className="p-4 w-full sm:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h2 className="text-2xl font-bold text-black">Active Reports</h2>
              <p className="text-xl text-black">{activeReportsCount}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 px-4">
          <h2 className="text-2xl font-bold mb-4 text-black">Active Reports</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-4 py-2 text-black">Report ID</th>
                <th className="px-4 py-2 text-black">Status</th>
                <th className="px-4 py-2 text-black">Last Updated</th>
                <th className="px-4 py-2 text-black">Comment</th>
                <th className="px-4 py-2 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeReports.map(report => (
                <tr key={report.id}>
                  <td className="border px-4 py-2 text-black">{report.id}</td>
                  <td className={`border px-4 py-2 ${report.status ? 'bg-green-100' : 'bg-red-100'} text-black`}>{report.status ? 'Active' : 'Inactive'}</td>
                  <td className="border px-4 py-2 text-black">{report.lastupdated?.toDate().toLocaleString()}</td>
                  <td className="border px-4 py-2 text-black">{report.comment}</td>
                  <td className="border px-4 py-2">
                    <button className="text-blue-500 hover:underline" onClick={() => setSelectedReport(report)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Edit Report</h2>
            <label className="block text-sm font-bold mb-2 text-black">Report ID</label>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 mb-4 w-full text-black placeholder-black"
              value={selectedReport.id}
              onChange={(e) => setSelectedReport({ ...selectedReport, id: e.target.value })}
              placeholder="Enter Report ID"
              required
            />
            <label className="block text-sm font-bold mb-2 text-black">Status</label>
            <select
              className="border rounded-lg px-3 py-2 mb-4 w-full text-black"
              value={selectedReport.status ? 'true' : 'false'}
              onChange={(e) => setSelectedReport({ ...selectedReport, status: e.target.value === 'true' })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <label className="block text-sm font-bold mb-2 text-black">Comment</label>
            <textarea
              className="border rounded-lg px-3 py-2 mb-4 w-full text-black placeholder-black"
              value={selectedReport.comment}
              onChange={(e) => setSelectedReport({ ...selectedReport, comment: e.target.value })}
              placeholder="Enter Comment"
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mr-2"
              onClick={handleUpdateReport}
            >
              Update Report
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => setSelectedReport(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MainMenu;
