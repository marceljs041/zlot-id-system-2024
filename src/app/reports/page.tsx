"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({ id: '', status: true, lastupdated: '', comment: '' });
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      const querySnapshot = await getDocs(collection(db, "ERs"));
      const reportsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setReports(reportsList);
    };

    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "ERs"), {
      ...newReport,
      lastupdated: serverTimestamp()
    });
    const querySnapshot = await getDocs(collection(db, "ERs"));
    const reportsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setReports(reportsList);
    setNewReport({ id: '', status: true, lastupdated: '', comment: '' });
  };

  const handleUpdateReport = async () => {
    const reportRef = doc(db, "ERs", selectedReport.id);
    await updateDoc(reportRef, {
      ...selectedReport,
      lastupdated: serverTimestamp()
    });
    const querySnapshot = await getDocs(collection(db, "ERs"));
    const reportsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setReports(reportsList);
    setSelectedReport(null);
  };

  return (
    <>
      <Head>
        <title>Reports</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div className="flex flex-col items-center mt-8 px-4">
          <h1 className="text-5xl font-bold mb-5 text-black">Reports</h1>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-md">
            <label className="block text-sm font-bold mb-2 text-black">Report ID</label>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 mb-4 w-full text-black placeholder-black"
              value={newReport.id}
              onChange={(e) => setNewReport({ ...newReport, id: e.target.value })}
              placeholder="Enter Report ID"
              required
            />
            <label className="block text-sm font-bold mb-2 text-black">Status</label>
            <select
              className="border rounded-lg px-3 py-2 mb-4 w-full text-black"
              value={newReport.status ? 'true' : 'false'}
              onChange={(e) => setNewReport({ ...newReport, status: e.target.value === 'true' })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <label className="block text-sm font-bold mb-2 text-black">Comment</label>
            <textarea
              className="border rounded-lg px-3 py-2 mb-4 w-full text-black placeholder-black"
              value={newReport.comment}
              onChange={(e) => setNewReport({ ...newReport, comment: e.target.value })}
              placeholder="Enter Comment"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Create Report
            </button>
          </form>
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
              {reports.map(report => (
                <tr key={report.id}>
                  <td className="border px-4 py-2 text-black">{report.id}</td>
                  <td className={`border px-4 py-2 ${report.status ? 'bg-green-100' : 'bg-red-100'} text-black`}>{report.status ? 'Active' : 'Inactive'}</td>
                  <td className="border px-4 py-2 text-black">{report.lastupdated?.toDate().toLocaleString()}</td>
                  <td className="border px-4 py-2 text-black">{report.comment}</td>
                  <td className="border px-4 py-2">
                    <button className="text-blue-500 hover:underline" onClick={() => setSelectedReport(report)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Reports;
