import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import ApiService from '../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiBookOpen } from 'react-icons/fi';

const Programs = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAdminPrograms();
      
      // Handle the new response format
      if (response && response.success && Array.isArray(response.data)) {
        setPrograms(response.data);
      } else if (response && Array.isArray(response)) {
        // Fallback for old format
        setPrograms(response);
      } else {
        setPrograms([]);
        console.error('Unexpected response format:', response);
      }
      
      setError('');
    } catch (err) {
      console.error('Failed to fetch programs:', err);
      setError('Failed to load programs. Please try again.');
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProgram = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.deleteProgram(id);
      
      if (response && response.success) {
        setPrograms(programs.filter(program => program._id !== id));
      } else {
        throw new Error('Failed to delete program');
      }
    } catch (err) {
      console.error('Failed to delete program:', err);
      setError('Failed to delete program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Program Management</h1>
          <button 
            onClick={() => navigate('/admin/programs/new')}
            className="bg-[#704ee7] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#5f39e4] transition-colors"
          >
            <FiPlus /> Add New Program
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#704ee7]"></div>
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FiBookOpen className="mx-auto text-gray-400 text-5xl mb-4" />
            <h2 className="text-xl font-medium text-gray-600 mb-2">No Programs Found</h2>
            <p className="text-gray-500 mb-6">Get started by creating a new program.</p>
            <button 
              onClick={() => navigate('/admin/programs/new')}
              className="bg-[#704ee7] text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-[#5f39e4] transition-colors"
            >
              <FiPlus /> Add New Program
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semesters
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tools
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {programs.map((program) => (
                    <tr key={program._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{program.programName}</div>
                        <div className="text-sm text-gray-500">{program.programId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.semesterCount || '–'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.fee || '–'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {program.toolkit && program.toolkit.length > 0 
                            ? `${program.toolkit.length} tools` 
                            : 'No tools'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin/programs/edit/${program._id}`)}
                          className="text-[#704ee7] hover:text-[#5f39e4] mx-2"
                        >
                          <FiEdit2 className="inline" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(program._id)}
                          className="text-red-600 hover:text-red-800 mx-2"
                        >
                          <FiTrash2 className="inline" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs; 