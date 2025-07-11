import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import ApiService from '../services/api';
import { FiSave, FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';

const ProgramForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== 'new';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    programName: '',
    programId: '',
    detail: '',
    semesterCount: '',
    fee: '',
    collegeHame: '',
    eligibility: '',
    semesters: [],
    enrollmentDetails: { fee: '1000' }
  });

  // For tools and facts management
  const [tools, setTools] = useState([]);
  const [facts, setFacts] = useState([]);
  const [newTool, setNewTool] = useState({ name: '', logoUrl: '' });
  const [newFact, setNewFact] = useState({ content: '', imageUrl: '', highlight: '' });

  useEffect(() => {
    if (isEditMode) {
      fetchProgram();
    }
  }, [id]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAdminProgramById(id);
      
      if (response && response.success) {
        const program = response.data;
        setFormData({
          programName: program.programName || '',
          programId: program.programId || '',
          detail: program.detail || '',
          semesterCount: program.semesterCount || '',
          fee: program.fee || '',
          collegeName: program.collegeName || '',
          eligibility: program.eligibility || '',
          semesters: program.semesters || [],
          enrollmentDetails: program.enrollmentDetails || { fee: '1000' }
        });
        
        setTools(program.toolkit || []);
        setFacts(program.facts || []);
      } else {
        setError('Failed to load program details');
      }
    } catch (err) {
      console.error('Error fetching program:', err);
      setError('Error loading program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToolInputChange = (e) => {
    const { name, value } = e.target;
    setNewTool(prev => ({ ...prev, [name]: value }));
  };

  const handleFactInputChange = (e) => {
    const { name, value } = e.target;
    setNewFact(prev => ({ ...prev, [name]: value }));
  };

  const addTool = async () => {
    if (!newTool.name || !newTool.logoUrl) {
      setError('Tool name and logo URL are required');
      return;
    }

    try {
      if (isEditMode) {
        setSaving(true);
        const response = await ApiService.addToolToProgram(id, newTool);
        if (response && response.success) {
          setTools(response.data.toolkit || []);
          setNewTool({ name: '', logoUrl: '' });
          setSuccessMessage('Tool added successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError('Failed to add tool');
        }
      } else {
        // For new programs, just add to local state
        setTools(prev => [...prev, { ...newTool, _id: Date.now().toString() }]);
        setNewTool({ name: '', logoUrl: '' });
      }
    } catch (err) {
      console.error('Error adding tool:', err);
      setError('Failed to add tool. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeTool = async (toolId) => {
    try {
      if (isEditMode) {
        setSaving(true);
        const response = await ApiService.removeToolFromProgram(id, toolId);
        if (response && response.success) {
          setTools(response.data.toolkit || []);
          setSuccessMessage('Tool removed successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError('Failed to remove tool');
        }
      } else {
        // For new programs, just remove from local state
        setTools(prev => prev.filter(tool => tool._id !== toolId));
      }
    } catch (err) {
      console.error('Error removing tool:', err);
      setError('Failed to remove tool. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addFact = async () => {
    if (!newFact.content) {
      setError('Fact content is required');
      return;
    }

    try {
      if (isEditMode) {
        setSaving(true);
        const response = await ApiService.addFactToProgram(id, newFact);
        if (response && response.success) {
          setFacts(response.data.facts || []);
          setNewFact({ content: '', imageUrl: '', highlight: '' });
          setSuccessMessage('Fact added successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError('Failed to add fact');
        }
      } else {
        // For new programs, just add to local state
        setFacts(prev => [...prev, { ...newFact, _id: Date.now().toString() }]);
        setNewFact({ content: '', imageUrl: '', highlight: '' });
      }
    } catch (err) {
      console.error('Error adding fact:', err);
      setError('Failed to add fact. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeFact = async (factId) => {
    try {
      if (isEditMode) {
        setSaving(true);
        const response = await ApiService.removeFactFromProgram(id, factId);
        if (response && response.success) {
          setFacts(response.data.facts || []);
          setSuccessMessage('Fact removed successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError('Failed to remove fact');
        }
      } else {
        // For new programs, just remove from local state
        setFacts(prev => prev.filter(fact => fact._id !== factId));
      }
    } catch (err) {
      console.error('Error removing fact:', err);
      setError('Failed to remove fact. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.programName) {
      setError('Program name is required');
      return;
    }

    try {
      setSaving(true);
      let response;

      const submitData = {
        ...formData,
        toolkit: tools,
        facts: facts
      };

      if (isEditMode) {
        response = await ApiService.updateProgram(id, submitData);
      } else {
        response = await ApiService.createProgram(submitData);
      }

      if (response && response.success) {
        navigate('/admin/programs');
      } else {
        setError('Failed to save program');
      }
    } catch (err) {
      console.error('Error saving program:', err);
      setError('Failed to save program. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavBar />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#704ee7]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/admin/programs')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Program' : 'Create New Program'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Program Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name*
                </label>
                <input 
                  type="text"
                  name="programName"
                  value={formData.programName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
                  placeholder="Enter program name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program ID
                </label>
                <input 
                  type="text"
                  name="programId"
                  value={formData.programId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
                  placeholder="Auto-generated if left empty"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Description
              </label>
              <textarea 
                name="detail"
                value={formData.detail}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
                placeholder="Enter program description"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester Count
                </label>
                <input 
                  type="number"
                  name="semesterCount"
                  value={formData.semesterCount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
                  placeholder="e.g., 3"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Fee
                </label>
                <input 
                  type="text"
                  name="fee"
                  value={formData.fee}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
                  placeholder="e.g., ₹45,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College Name
                </label>
                <input 
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
                  placeholder="e.g., IIT Mandi"
                />
              </div>
            </div>
          </div>

          {/* Toolkit Management */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Tools Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tool Name
                </label>
                <input 
                  type="text"
                  name="name"
                  value={newTool.name}
                  onChange={handleToolInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
                  placeholder="e.g., Python"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input 
                  type="text"
                  name="logoUrl"
                  value={newTool.logoUrl}
                  onChange={handleToolInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
                  placeholder="e.g., https://example.com/python-logo.png"
                />
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={addTool}
                disabled={saving}
                className="bg-[#704ee7] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#5f39e4] transition-colors"
              >
                <FiPlus /> Add Tool
              </button>
            </div>

            {tools.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <div key={tool._id} className="border border-gray-200 rounded-md p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {tool.logoUrl && (
                        <img 
                          src={tool.logoUrl} 
                          alt={tool.name} 
                          className="w-8 h-8 object-contain" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50?text=Error';
                          }}
                        />
                      )}
                      <span>{tool.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTool(tool._id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={saving}
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tools.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No tools added yet. Add tools that students will learn in this program.
              </div>
            )}
          </div>

          {/* Facts Management */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Facts Management</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fact Content
                </label>
                <textarea 
                  name="content"
                  value={newFact.content}
                  onChange={handleFactInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
                  placeholder="e.g., 80% of emerging roles in India by 2026 will require CSE-related skills"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Highlight (Optional)
                  </label>
                  <input 
                    type="text"
                    name="highlight"
                    value={newFact.highlight}
                    onChange={handleFactInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
                    placeholder="e.g., 80%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL (Optional)
                  </label>
                  <input 
                    type="text"
                    name="imageUrl"
                    value={newFact.imageUrl}
                    onChange={handleFactInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#704ee7] focus:border-transparent"
                    placeholder="e.g., https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={addFact}
                disabled={saving}
                className="bg-[#704ee7] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#5f39e4] transition-colors"
              >
                <FiPlus /> Add Fact
              </button>
            </div>

            {facts.length > 0 && (
              <div className="space-y-4">
                {facts.map((fact) => (
                  <div key={fact._id} className="border border-gray-200 rounded-md p-4 flex justify-between">
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="font-medium">{fact.content}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        {fact.highlight && <span>Highlight: {fact.highlight}</span>}
                        {fact.imageUrl && (
                          <span className="flex items-center gap-1">
                            <img 
                              src={fact.imageUrl} 
                              alt="Fact" 
                              className="w-5 h-5 object-cover" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/30?text=Error';
                              }}
                            />
                            Image Attached
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFact(fact._id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={saving}
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {facts.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No facts added yet. Add facts about this program to show on the program details page.
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#704ee7] text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-[#5f39e4] transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FiSave />
                  {isEditMode ? 'Update Program' : 'Create Program'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramForm; 