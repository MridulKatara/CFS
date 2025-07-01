import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Clock from '../assets/Clock.svg';
import VideoCamera from '../assets/VideoCamera.svg';
import Back from '../assets/Icons.svg';
import ArrowRight from '../assets/ArrowRight.svg';
import BottomNavBar from './ButtomNavItem';
import apiService from '../services/api';
import Snackbar from '../components/Snackbar';

const MyPrograms = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getMyPrograms();
      setPrograms(response.data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setSnackbar({
        message: error.message || 'Failed to load programs',
        type: 'error'
      });
      // Set empty programs array on error
      setPrograms([]);
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

  const getActivePrograms = () => {
    return programs.filter(program => program.status === 'active' || program.isEnrolled);
  };

  const getOtherPrograms = () => {
    return programs.filter(program => program.status !== 'active' && !program.isEnrolled);
  };

  const calculateProgress = (program) => {
    if (!program.currentSemester || !program.totalSemesters) return 0;
    return Math.round((program.currentSemester / program.totalSemesters) * 100);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading programs...</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen bg-[#ffffff] overflow-y-auto pb-20">
        {/* Main Content */}
        <div className="px-4">
          {/* Header */}
          <div className="flex items-center justify-between mt-4 mb-6">
            <div className="w-8 h-8 cursor-pointer" onClick={handleBackClick}>
              <img className="w-full h-full" alt="Back" src={Back} />
            </div>
            <h1 className="text-2xl font-semibold text-[#000] font-poppins">My Programs</h1>
            <div className="w-8 h-8 invisible">
              <img className="w-full h-full" alt="" src={VideoCamera} />
            </div>
          </div>

          {/* Active Programs */}
          {getActivePrograms().length > 0 ? (
            <>
              {getActivePrograms().map((program) => (
                <div key={program._id} className="rounded-2xl bg-[#eee0fe] border border-[#704ee7] p-4 mb-6">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-sm font-medium">{program.title || program.name}</h2>
                  </div>
                  <p className="text-xs text-[#454545] mb-4">
                    {program.description || 'A comprehensive program introducing students to fundamentals and principles.'}
                  </p>
                  
                  <div className="flex gap-4 text-xs text-[#454545] mb-4">
                    <div className="flex items-center gap-1">
                      <img className="w-4 h-4" alt="Duration" src={Clock} />
                      <span>{program.duration || program.totalSemesters || 3} Semester</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <img className="w-4 h-4" alt="Mode" src={VideoCamera} />
                      <span>{program.mode || 'Online'}</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#454545]">
                    <div className="mb-2">
                      <span>Current - </span>
                      <span className="font-medium">Semester {program.currentSemester || 1}</span>
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
                        <button
                          onClick={() => handleGoClick(program._id, program.isEnrolled)}
                          className="text-[#ffffff] text-xs font-medium hover:bg-[#5f39e4] transition-colors cursor-pointer"
                        >
                          <img src={ArrowRight} alt="Arrow Right" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="rounded-2xl bg-[#eee0fe] border border-[#704ee7] p-6 mb-6 text-center">
              <h2 className="text-lg font-medium text-[#704ee7] mb-2">Get Your First Course Now</h2>
              <p className="text-sm text-[#454545] mb-4">
                Explore our minor programs and start your learning journey
              </p>
            </div>
          )}

          {/* Other Programs Section */}
          {getOtherPrograms().length > 0 && (
            <div>
              <h2 className="text-xl font-medium text-[#000] mb-4">Other Minor Programs</h2>
              <div className="space-y-4">
                {getOtherPrograms().map((program) => (
                  <div key={program._id} className="rounded-2xl bg-[#eee0fe] border border-[#704ee7] p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-medium">{program.title || program.name}</h3>
                    </div>
                    <p className="text-xs text-[#454545] mb-4">
                      {program.description || 'A comprehensive program introducing students to fundamentals and principles.'}
                    </p>
                    <div className="flex gap-4 text-xs text-[#454545] justify-between">
                      <div className='flex items-center gap-2'>
                        <div className="flex items-center gap-1">
                          <img className="w-4 h-4" alt="Duration" src={Clock} />
                          <span>{program.duration || program.totalSemesters || 3} Semester</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <img className="w-4 h-4" alt="Mode" src={VideoCamera} />
                          <span>{program.mode || 'Online'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleGoClick(program._id, program.isEnrolled)}
                        className="text-[#ffffff] text-xs font-medium hover:bg-[#5f39e4] transition-colors cursor-pointer"
                      >
                        <img src={ArrowRight} alt="Arrow Right" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Programs At All Message */}
          {programs.length === 0 && !isLoading && (
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
