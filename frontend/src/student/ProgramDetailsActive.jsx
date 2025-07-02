import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Back from '../assets/Icons.svg';
import Clock from '../assets/Clock.svg';
import VideoCamera from '../assets/VideoCamera.svg';
import Instructor from '../assets/instructor.jpg';
import ChatGPT from '../assets/t1.png';
import Plotly from '../assets/t2.png';
import NumPy from '../assets/t3.png';
import Spacy from '../assets/t4.jpg';
import Matplotlib from '../assets/t5.png';
import OpenCV from '../assets/t6.png';
import BottomNavBar from './ButtomNavItem';
import apiService from '../services/api';

const ProgramDetailsActive = () => {
  const navigate = useNavigate();
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getProgramDetails(programId);
        setProgram(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load program details');
        console.error('Error fetching program details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgram();
  }, [programId]);

  if (isLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center">Loading program details...</div>;
  }

  if (error || !program) {
    return <div className="w-full min-h-screen flex items-center justify-center text-red-500">{error || 'Program not found'}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white overflow-y-auto font-roboto pb-20">
     
      <div className="flex items-center justify-between px-4 mt-4 mb-6">
        <div className="w-8 h-8 cursor-pointer" onClick={() => navigate(-1)}>
            <img className="w-full h-full" alt="Back" src={Back} />
          </div>
        <h1 className="text-2xl font-semibold text-black font-poppins">Program Details</h1>
        <div className="w-8 h-8 invisible">
          <img className="w-full h-full" alt="" src="arrow_right_alt.svg" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-24">
        {/* Program Info */}
        <div className="mb-6">
          <h2 className="text-xl font-medium text-black mb-2">{program.programName}</h2>
          <p className="text-xs text-darkslategray mb-4">
            {program.detail}
          </p>
          <div className="flex gap-4 text-xs text-darkslategray">
            <div className="flex items-center gap-1">
              <img className="w-4 h-4" alt="Duration" src={Clock} />
              <span>{program.semesterCount} Semester</span>
            </div>
            <div className="flex items-center gap-1">
              <img className="w-4 h-4" alt="Mode" src={VideoCamera} />
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="text-xs text-darkslategray mb-2">Overall Progress</div>
            <div className="flex items-center gap-2">
            <div className='flex items-center gap-2'>
              <div className="relative w-[197px] h-1.5">
                <div className="absolute inset-0 rounded-3xl bg-[rgba(217,_217,_217,_0.6)]" />
                <div className="absolute left-0 top-0 w-[68%] h-full rounded-3xl bg-[#704ee7]" />
              </div>
              <span className="text-xs text-darkslategray">68%</span>
              </div>
             
            </div>
          </div>
          <div>
            <div className="text-xs text-darkslategray mb-2">Semester 1 progress</div>
            <div className='flex items-center gap-2'>
              <div className="relative w-[197px] h-1.5">
                <div className="absolute inset-0 rounded-3xl bg-[rgba(217,_217,_217,_0.6)]" />
                <div className="absolute left-0 top-0 w-[68%] h-full rounded-3xl bg-[#704ee7]" />
              </div>
              <span className="text-xs text-darkslategray">68%</span>
              </div>
          </div>
        </div>

        {/* Course Fee Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-black mb-2">Course Fee</h3>
          <p className="text-xs text-darkslategray mb-2">{program.fee} (₹{program.semesters?.[0]?.fee || 15000} per semester)</p>
          <div className="bg-[#f7f7f7] rounded-2xl p-3">
            <div className="flex justify-between">
              <div className="space-y-2 text-xs text-darkslategray">
                <p>Registration Fee</p>
                <p>1st Semester</p>
                <p>2nd Semester</p>
                <p>3rd Semester</p>
              </div>
              <div className="space-y-2 text-xs text-darkslategray">
                <p><span>- </span><span className="text-[#008000]">Paid</span></p>
                <p><span>- </span><span className="font-medium">₹{program.semesters?.[0]?.fee || 15000}</span></p>
                <p><span>- </span><span className="font-medium">₹{program.semesters?.[1]?.fee || 15000}</span></p>
                <p><span>- </span><span className="font-medium">₹{program.semesters?.[2]?.fee || 15000}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-black mb-4">Tools You Will Learn:</h3>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <img className="w-16 h-16 object-contain" alt="ChatGPT" src={ChatGPT} />
            <img className="w-16 h-16 object-contain" alt="Plotly" src={Plotly} />
            <img className="w-16 h-16 object-contain" alt="NumPy" src={NumPy} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <img className="w-16 h-16 object-contain" alt="Spacy" src={Spacy} />
            <img className="w-16 h-16 object-contain" alt="Matplotlib" src={Matplotlib} />
            <img className="w-16 h-16 object-contain" alt="OpenCV" src={OpenCV} />
          </div>
        </div>

        {/* Faculty Section */}
        <div>
          <h3 className="text-sm font-medium text-black mb-4">Faculty</h3>
          <div className="space-y-3">
            {program.faculty?.map((faculty, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-3xl border border-[#F5F5F5]">
                <img className="w-14 h-14 rounded-[12.8px] object-cover" alt={faculty.name} src={Instructor} />
                <div>
                  <h4 className="text-sm font-medium text-black">{faculty.name}</h4>
                  <p className="text-xs text-darkslategray">{faculty.designation}</p>
                  <p className="text-xs font-medium text-darkslategray">{program.collegeName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Learning Button */}
        <div className="mt-8 mb-6">
          <button className="w-full py-2.5 px-5 bg-[#6d4ae7] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity font-poppins">
            Continue Learning
          </button>
        </div>
      </div>
      
      <BottomNavBar />
    </div>
  )
}

export default ProgramDetailsActive
