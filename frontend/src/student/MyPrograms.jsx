import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Clock from '../assets/Clock.svg';
import VideoCamera from '../assets/VideoCamera.svg';
import Back from '../assets/Icons.svg';
import BottomNavBar from './ButtomNavItem';
import apiService from '../services/api';
import Snackbar from '../components/Snackbar';

const MyPrograms = () => {
  const navigate = useNavigate();
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch enrolled programs
      const enrolledResponse = await apiService.getMyPrograms();
      const enrolledData = enrolledResponse.data || [];
      setEnrolledPrograms(enrolledData);
      
      // Fetch all programs
      const allProgramsResponse = await apiService.getPrograms();
      console.log('All programs response:', allProgramsResponse);
      const allProgramsData = allProgramsResponse || [];
      setAllPrograms(allProgramsData);
      
    } catch (error) {
      console.error('Error fetching programs:', error);
      setSnackbar({
        message: error.message || 'Failed to load programs',
        type: 'error'
      });
      setEnrolledPrograms([]);
      setAllPrograms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoClick = (programId, isEnrolled) => {
    if (isEnrolled) {
      navigate(`/program-details-active/${programId}`);
    } else {
      navigate(`/program-details-inactives/${programId}`);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Get enrolled program IDs for comparison
  const getEnrolledProgramIds = () => {
    return enrolledPrograms.map(program => program.programId);
  };

  // Filter programs that user is enrolled in
  const getActivePrograms = () => {
    const enrolledIds = getEnrolledProgramIds();
    return allPrograms.filter(program => 
      enrolledIds.includes(program.programId)
    );
  };

  // Filter programs that user is NOT enrolled in
  const getOtherPrograms = () => {
    const enrolledIds = getEnrolledProgramIds();
    return allPrograms.filter(program => 
      !enrolledIds.includes(program.programId)
    );
  };

  const calculateProgress = () => {
    return 33;
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading programs...</div>
      </div>
    );
  }

  const activePrograms = getActivePrograms();
  const otherPrograms = getOtherPrograms();

  console.log('All Programs:', allPrograms);
  console.log('Enrolled Programs:', enrolledPrograms);
  console.log('Active Programs:', activePrograms);
  console.log('Other Programs:', otherPrograms);

  return (
    <>
      <div className="w-full min-h-screen bg-[#ffffff] overflow-y-auto pb-20">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-4 py-5 flex items-center">
          <button 
            onClick={handleBackClick}
            className="w-8 h-8 flex items-center justify-center"
          >
            <img className="w-6 h-6" alt="Back" src={Back} />
          </button>
          <h1 className="text-[#202124] text-2xl font-semibold flex-1 text-center">My Programs</h1>
          <div className="w-8 h-8"></div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-4">
          {/* Active Programs or Empty State */}
          {activePrograms.length > 0 ? (
            activePrograms.map((program) => (
              <div 
                key={program._id} 
                className="rounded-2xl border border-[#704ee7] p-4 relative shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                style={{ 
                  backgroundImage: 'url("/Frame 1707487247.svg")', 
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                onClick={() => handleGoClick(program._id, true)}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-sm font-medium">{program.programName}</h2>
                  </div>
                  <p className="text-xs text-[#454545] mb-4">
                    {program.detail}
                  </p>
                  <div className="flex gap-4 text-xs text-[#454545] mb-4">
                    <div className="flex items-center gap-1">
                      <img className="w-4 h-4" alt="Duration" src={Clock} />
                      <span>{program.semesterCount || 3} Semester</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <img className="w-4 h-4" alt="Mode" src={VideoCamera} />
                      <span>Online</span>
                    </div>
                  </div>
                  <div className="text-xs text-[#454545]">
                    <div className="mb-2">
                      <span>Current - </span>
                      <span className="font-medium">Semester 1</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className='flex items-center gap-2'>
                          <div className="relative w-[97px] h-1.5">
                            <div className="absolute inset-0 rounded-3xl bg-[rgba(217,_217,_217,_0.6)]" />
                            <div 
                              className="absolute left-0 top-0 h-full rounded-3xl bg-[#704ee7]" 
                              style={{ width: `${calculateProgress(program)}%` }}
                            />
                          </div>
                          <span>{calculateProgress(program)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div 
              className="rounded-2xl border border-[#704ee7] p-6 text-center relative shadow-sm"
              style={{ 
                backgroundImage: 'url("/Frame 1707487247.svg")', 
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="relative z-10">
                <h2 className="text-lg font-medium text-[#704ee7] mb-2">You are not enrolled in any program yet</h2>
                <p className="text-sm text-[#454545] mb-4">
                  Explore our minor programs and start your learning journey!
                </p>
              </div>
            </div>
          )}

          {/* Other Programs Section */}
          {otherPrograms.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-medium text-[#202124] mb-4">Other Minor Programs</h2>
              <div className="space-y-4">
                {otherPrograms.map((program) => (
                  <div 
                    key={program._id} 
                    className="rounded-2xl border border-[#704ee7] p-4 relative shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                    style={{ 
                      backgroundImage: 'url("/Frame 1707487247.svg")', 
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    onClick={() => handleGoClick(program._id, false)}
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-medium">{program.programName}</h3>
                      </div>
                      <p className="text-xs text-[#454545] mb-4">
                        {program.detail}
                      </p>
                      <div className="flex gap-4 text-xs text-[#454545] justify-between">
                        <div className='flex items-center gap-2'>
                          <div className="flex items-center gap-1">
                            <img className="w-4 h-4" alt="Duration" src={Clock} />
                            <span>{program.semesterCount || 3} Semester</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <img className="w-4 h-4" alt="Mode" src={VideoCamera} />
                            <span>Online</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Programs At All Message */}
          {allPrograms.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500">No programs found. Please check back later.</p>
            </div>
          )}
        </div>
        <BottomNavBar />
      </div>
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </>
  );
};

export default MyPrograms;
