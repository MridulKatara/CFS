import React, { useState, useEffect } from "react";
import BottomNavBar from "./ButtomNavItem";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../services/api";
import Back from "../assets/Icons.svg";

const ProgramDetailsInactives = () => {
  const navigate = useNavigate();
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const facultyData = [
    { name: "Dr.Abhinava Tripati", role: "Assistant Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/bcee9c75-9520-4472-b96b-3a755d924020/0az1FSVstjFXSHT0.png` },
    { name: "Dr. Sneha Singh", role: "Assistant Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/7e1bf450-21d5-4b20-bb8e-337125f6403e/VCRFTyaLfVypom0E.jpeg` },
    { name: "Dr. Adarsh Patel", role: "Assistant Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/082dec54-2aae-400d-91f7-eae85b1f29bc/RfpSqCRu2ygjuABy.jpg` },
    { name: "Dr. Jyoti Nigam", role: "Assistant Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/b75b532e-5525-4ccd-9acf-d40864e56ca0/IQCa1KCiiylDPpfQ.jpg` },
    { name: "Dr. Aditya Nigam", role: "Assistant Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/a0796d9b-f275-4972-ac4e-ced4ac254f2c/QFbrkXcIrCTP1tH0.png` },
    { name: "Dr. Manoj Thakur", role: "Assistant Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/82faf43a-ab76-4010-813a-c8c998eac79e/RXtSQYD3pKKCY2l3.png` },
    { name: "Dr. Varun Kumar", role: "Assistant Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/0306b6f5-afb0-4b31-8cfc-4f9ae8261ead/BbPbaxvLZTGdGbw0.png` },
  ];

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getProgramDetails(programId);
        setProgram(response.data);
      } catch (err) {
        setError(err.message || "Failed to load program details");
        console.error("Error fetching program details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgram();
  }, [programId]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span style={{ fontSize: "18px" }}>Loading program details...</span>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-500">
        <span style={{ fontSize: "18px" }}>{error || "Program not found"}</span>
      </div>
    );
  }

  const handleRegisterClick = () => {
    navigate("/payment", {
      state: { registration: true, programId: program._id },
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20 flex flex-col">
      <div className="max-w-[375px] mx-auto min-h-screen bg-white flex flex-col flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-4 mt-4 mb-6">
          <div className="w-8 h-8 cursor-pointer" onClick={() => navigate(-1)}>
            <img className="w-full h-full" alt="Back" src={Back} />
          </div>
          <h1 className="text-[26px] font-semibold text-black font-poppins">
            Program Details
          </h1>
          <div className="w-8 h-8 invisible">
            <img className="w-full h-full" alt="" src="arrow_right_alt.svg" />
          </div>
        </div>

        <div className="flex-1 px-4 pb-32">
          <div className="mb-6">
            <h2 className="text-[22px] font-medium text-black mb-2">
              {program.programName}
            </h2>
            <p className="text-sm text-darkslategray mb-4">{program.detail}</p>
          </div>
          
          <div className="flex items-center gap-3 mb-4 rounded-xl border border-whitesmoke-300 overflow-hidden">
            <div className="h-[72px] w-[69px] rounded-xl p-[10px] bg-[#704ee7] flex items-center justify-center">
              <b className="text-white text-[26px]">80%</b>
            </div>
            <div className="flex-1 py-3 pr-3">
              <p className="text-sm text-dimgray font-medium">
                of emerging roles in India by 2026 will require CSE-related skills
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-6 rounded-xl border border-whitesmoke-300">
            <img
              className="w-[69px] h-[70px] rounded-xl"
              alt=""
              src={`https://coding-platform.s3.amazonaws.com/dev/lms/tickets/9d8a190a-b0e6-49d7-9a3c-629a157478ff/Aq3GxyQrNXsEM2FZ.png`}
            />
            <div className="flex-1">
              <p className="text-sm text-dimgray">
                <i className="font-medium">
                  It is not about man versus machine anymore. It is about man with machine versus man without.
                </i>
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-base font-medium mb-2">Duration</h3>
            <p className="text-sm text-darkslategray">
              {program.semesterCount} Semester
            </p>
          </div>
	
          <div className="mb-6">
            <h3 className="text-base font-medium text-black mb-2">Course Fee</h3>
            <p className="text-sm text-darkslategray mb-2">
              {program.fee} (₹{program.semesters?.[0]?.fee || 15000} per semester)
            </p>
            <div className="rounded-2xl bg-[#f7f7f7] p-3">
              <div className="flex justify-between">
                <div className="space-y-2 text-sm text-darkslategray">
                  <p>Registration Fee</p>
                  <p>1st Semester</p>
                  <p>2nd Semester</p>
                  <p>3rd Semester</p>
                </div>
                <div className="space-y-2 text-sm text-darkslategray">
                  <p>
                    <span>- </span>
                    <span className="font-medium">₹1000</span>
                  </p>
                  <p>
                    <span>- </span>
                    <span className="font-medium">₹{14000}</span>
                  </p>
                  <p>
                    <span>- </span>
                    <span className="font-medium">
                      ₹{program.semesters?.[1]?.fee || 15000}
                    </span>
                  </p>
                  <p>
                    <span>- </span>
                    <span className="font-medium">
                      ₹{program.semesters?.[2]?.fee || 15000}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {program.toolkit && program.toolkit.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-black mb-4">
              Tools You Will Learn:
            </h3>
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
          <div className="mb-6">
            <h3 className="text-base font-medium mb-4">Faculty</h3>
            <div className="space-y-3">
              {facultyData.map((faculty, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-3xl border border-whitesmoke-200"
                >
                  <img
                    className="w-14 h-14 rounded-[12.8px] object-cover"
                    alt={faculty.name}
                    src={faculty.img}
                  />
                  <div>
                    <h4 className="text-base font-medium text-black">
                      {faculty.name}
                    </h4>
                    <p className="text-sm text-darkslategray">
                      {faculty.designation}
                    </p>
                    <p className="text-sm font-medium text-darkslategray">
                      {faculty.institution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <button
              className="w-full rounded-lg bg-[#5f39e4] py-2.5 px-5 text-white font-poppins font-semibold text-base"
              onClick={handleRegisterClick}
            >
              Pay ₹{program.enrollmentDetails?.fee || 1000} & Register Now
            </button>
          </div>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default ProgramDetailsInactives;
