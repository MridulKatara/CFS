import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Back from '../assets/Icons.svg';
import Clock from '../assets/Clock.svg';
import VideoCamera from '../assets/VideoCamera.svg';
import BottomNavBar from './ButtomNavItem';
import apiService from '../services/api';

const ProgramDetailsActive = () => {
  const navigate = useNavigate();
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const facultyData = [
    { name: "Dr. Tushar JAIN", designation: "Head CCE, IIT Mandi", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/96ea7635-f86d-4314-a878-635f02678a11/DMao2csPnQRdUE0G.jpg` },
    { name: "Dr. Sneha Singh", designation: "Associate Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/7e1bf450-21d5-4b20-bb8e-337125f6403e/VCRFTyaLfVypom0E.jpeg` },
    { name: "Dr. Adarsh Patel", designation: "Assistant Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/082dec54-2aae-400d-91f7-eae85b1f29bc/RfpSqCRu2ygjuABy.jpg` },
    { name: "Dr. Jyoti Nigam", designation: "Assistant Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/b75b532e-5525-4ccd-9acf-d40864e56ca0/IQCa1KCiiylDPpfQ.jpg` },
  ];

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
    return <div className="w-full min-h-screen flex items-center justify-center" style={{ fontSize: "20px" }}>Loading program details...</div>;
  }

  if (error || !program) {
    return <div className="w-full min-h-screen flex items-center justify-center text-red-500" style={{ fontSize: "20px" }}>{error || 'Program not found'}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white overflow-y-auto font-roboto pb-20">
      <div className="flex items-center justify-between px-4 mt-4 mb-6">
        <div className="w-8 h-8 cursor-pointer" onClick={() => navigate(-1)}>
          <img className="w-full h-full" alt="Back" src={Back} />
        </div>
        <h1 className="text-[26px] font-semibold text-black font-poppins">Program Details</h1>
        <div className="w-8 h-8 invisible">
          <img className="w-full h-full" alt="" src="arrow_right_alt.svg" />
        </div>
      </div>
      <div className="px-4 pb-24">
        <div className="mb-6">
          <h2 className="text-[22px] font-medium text-black mb-2">{program.programName}</h2>
          <p className="text-sm text-darkslategray mb-4">{program.detail}</p>
          <div className="flex gap-4 text-sm text-darkslategray">
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
        <div className="space-y-4 mb-6">
          <div>
            <div className="text-sm text-darkslategray mb-2">Overall Progress</div>
            <div className="flex items-center gap-2">
              <div className='flex items-center gap-2'>
                <div className="relative w-[197px] h-1.5">
                  <div className="absolute inset-0 rounded-3xl bg-[rgba(217,_217,_217,_0.6)]" />
                  <div className="absolute left-0 top-0 w-[68%] h-full rounded-3xl bg-[#704ee7]" />
                </div>
                <span className="text-sm text-darkslategray">68%</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-darkslategray mb-2">Semester 1 progress</div>
            <div className='flex items-center gap-2'>
              <div className="relative w-[197px] h-1.5">
                <div className="absolute inset-0 rounded-3xl bg-[rgba(217,_217,_217,_0.6)]" />
                <div className="absolute left-0 top-0 w-[68%] h-full rounded-3xl bg-[#704ee7]" />
              </div>
              <span className="text-sm text-darkslategray">68%</span>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-base font-medium text-black mb-2">Course Fee</h3>
          <p className="text-sm text-darkslategray mb-2">{program.fee} (₹{program.semesters?.[0]?.fee || 15000} per semester)</p>
          <div className="bg-[#f7f7f7] rounded-2xl p-3">
            <div className="flex justify-between">
              <div className="space-y-2 text-sm text-darkslategray">
                <p>Registration Fee</p>
                <p>1st Semester</p>
                <p>2nd Semester</p>
                <p>3rd Semester</p>
              </div>
              <div className="space-y-2 text-sm text-darkslategray">
                <p><span>- </span><span className="text-[#008000]">Paid</span></p>
                <p><span>- </span><span className="font-medium">₹{program.semesters?.[0]?.fee || 14000}</span></p>
                <p><span>- </span><span className="font-medium">₹{program.semesters?.[1]?.fee || 15000}</span></p>
                <p><span>- </span><span className="font-medium">₹{program.semesters?.[2]?.fee || 15000}</span></p>
              </div>
            </div>
          </div>
        </div>
        {program.toolkit && program.toolkit.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-black mb-4">Tools You Will Learn:</h3>
            <div className="grid grid-cols-3 gap-4">
              {program.toolkit.map((tool, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img 
                    className="w-16 h-16 object-contain" 
                    alt={tool.name} 
                    src={tool.logoUrl} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/64?text=' + tool.name.charAt(0);
                    }}
                  />
                  <p className="text-xs text-center mt-1">{tool.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <h3 className="text-base font-medium text-black mb-4">Faculty</h3>
          <div className="space-y-3">
            {facultyData.map((faculty, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-3xl border border-[#F5F5F5]">
                <img className="w-14 h-14 rounded-[12.8px] object-cover" alt={faculty.name} src={faculty.img} />
                <div>
                  <h4 className="text-base font-medium text-black">{faculty.name}</h4>
                  <p className="text-sm text-darkslategray">{faculty.designation}</p>
                  <p className="text-sm font-medium text-darkslategray">{faculty.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 mb-6">
          <button className="w-full py-2.5 px-5 bg-[#6d4ae7] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity font-poppins text-base">
            Continue Learning
          </button>
        </div>
      </div>
      <BottomNavBar />
    </div>
  )
}

export default ProgramDetailsActive
