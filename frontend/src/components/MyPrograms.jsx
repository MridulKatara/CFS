import React from 'react';
import { useNavigate } from 'react-router-dom';
import Clock from '../assets/Clock.svg';
import VideoCamera from '../assets/VideoCamera.svg';
import Back from '../assets/Icons.svg';
import ArrowRight from '../assets/ArrowRight.svg';

const MyPrograms = () => {
  const navigate = useNavigate();

  const handleGoClick = () => {
    navigate('/program-details-active');
  };

  const handleInactiveGoClick = () => {
    navigate('/program-details-inactive');
  };

  return (
    <div className="w-full min-h-screen bg-[#ffffff] overflow-y-auto">
      {/* Main Content */}
      <div className="px-4">
        {/* Header */}
        <div className="flex items-center justify-between mt-4 mb-6">
          <div className="w-8 h-8 cursor-pointer">
            <img className="w-full h-full" alt="Back" src={Back} />
          </div>
          <h1 className="text-2xl font-semibold text-[#000] font-poppins">My Programs</h1>
          <div className="w-8 h-8 invisible">
            <img className="w-full h-full" alt="" src={VideoCamera} />
          </div>
        </div>

        {/* Active Program Card */}
        <div className="rounded-2xl bg-[#eee0fe] border border-[#704ee7] p-4 mb-6">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-sm font-medium">Minor in CSE</h2>
          </div>
          <p className="text-xs text-[#454545] mb-4">
            A comprehensive program introducing students to computer science fundamentals and software engineering principles.
          </p>
          
          <div className="flex gap-4 text-xs text-[#454545] mb-4">
            <div className="flex items-center gap-1">
              <img className="w-4 h-4" alt="Duration" src={Clock} />
              <span>3 Semester</span>
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
                <div className="absolute left-0 top-0 w-[68%] h-full rounded-3xl bg-[#704ee7]" />
              </div>
              <span>64%</span>
              </div>
              <button
              onClick={handleGoClick}
              className="text-[#ffffff] text-xs font-medium hover:bg-[#5f39e4] transition-colors"
            >
             <img src={ArrowRight} alt="Arrow Right" />
            </button>
            </div>
           
          </div>
          
            </div>
        </div>

        {/* Other Programs Section */}
        <div>
          <h2 className="text-xl font-medium text-[#000] mb-4">Other Minor Programs</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="rounded-2xl bg-[#eee0fe] border border-[#704ee7] p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-medium">Minor in CSE</h3>
                </div>
                <p className="text-xs text-[#454545] mb-4">
                  A comprehensive program introducing students to computer science fundamentals and software engineering principles.
                </p>
                <div className="flex gap-4 text-xs text-[#454545] justify-between">
                    <div className='flex items-center gap-2'>
                  <div className="flex items-center gap-1">
                    <img className="w-4 h-4" alt="Duration" src={Clock} />
                    <span>3 Semester</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <img className="w-4 h-4" alt="Mode" src={VideoCamera} />
                    <span>Online</span>
                  </div>
                  </div>
                  <button
              onClick={handleInactiveGoClick}
              className="text-[#ffffff] text-xs font-medium hover:bg-[#5f39e4] transition-colors"
            >
             <img src={ArrowRight} alt="Arrow Right" />
            </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPrograms;
