import React, { useState, useEffect } from 'react';
import AdminNavBar from './AdminNavBar';
import ApiService from '../services/api';

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newUniversity, setNewUniversity] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  // Fetch universities on component mount
  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getUniversities();
      setUniversities(data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch universities:', err);
      setError('Failed to load universities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUniversity = async (e) => {
    e.preventDefault();
    if (!newUniversity.trim()) return;

    try {
      setLoading(true);
      await ApiService.addUniversity({ name: newUniversity.trim() });
      setNewUniversity('');
      await fetchUniversities();
    } catch (err) {
      console.error('Failed to add university:', err);
      setError('Failed to add university. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUniversity = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editingId) return;

    try {
      setLoading(true);
      await ApiService.updateUniversity(editingId, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
      await fetchUniversities();
    } catch (err) {
      console.error('Failed to update university:', err);
      setError('Failed to update university. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUniversity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this university?')) return;

    try {
      setLoading(true);
      await ApiService.deleteUniversity(id);
      await fetchUniversities();
    } catch (err) {
      console.error('Failed to delete university:', err);
      setError('Failed to delete university. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (university) => {
    setEditingId(university._id);
    setEditName(university.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Manage Universities</h1>

        {/* Add new university form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New University</h2>
          <form onSubmit={handleAddUniversity} className="flex gap-4">
            <input
              type="text"
              value={newUniversity}
              onChange={(e) => setNewUniversity(e.target.value)}
              placeholder="Enter university name"
              className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7]"
              disabled={loading}
              required
            />
            <button
              type="submit"
              className="bg-[#704ee7] text-white rounded-lg px-4 py-2 font-medium hover:bg-[#5f39e4] transition-colors"
              disabled={loading || !newUniversity.trim()}
            >
              {loading ? 'Adding...' : 'Add University'}
            </button>
          </form>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Universities list */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Universities List</h2>
          
          {loading && <p className="text-gray-500">Loading...</p>}
          
          {!loading && universities.length === 0 && (
            <p className="text-gray-500">No universities found. Add one above.</p>
          )}
          
          {!loading && universities.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {universities.map((university) => (
                    <tr key={university._id} className="border-t">
                      <td className="px-4 py-3">
                        {editingId === university._id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7]"
                            autoFocus
                          />
                        ) : (
                          university.name
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {editingId === university._id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleEditUniversity}
                              className="bg-green-600 text-white rounded px-3 py-1 text-sm font-medium hover:bg-green-700 transition-colors"
                              disabled={loading}
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-300 text-gray-800 rounded px-3 py-1 text-sm font-medium hover:bg-gray-400 transition-colors"
                              disabled={loading}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEditing(university)}
                              className="bg-[#704ee7] text-white rounded px-3 py-1 text-sm font-medium hover:bg-[#5f39e4] transition-colors"
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUniversity(university._id)}
                              className="bg-red-600 text-white rounded px-3 py-1 text-sm font-medium hover:bg-red-700 transition-colors"
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Universities; 