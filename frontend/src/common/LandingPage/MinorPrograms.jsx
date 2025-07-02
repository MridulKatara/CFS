import React, { useEffect, useState } from "react";
import { ArrowRight, Clock, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../auth";
// Uncomment if you want fallback data
// import programsData from "../../data/minorPrograms.json";

export default function MinorPrograms() {
  const navigate = useNavigate();
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch all programs and enrolled programs when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://cfs-djzu.onrender.com';
        console.log("API URL:", apiUrl);
        
        // Fetch from allprograms endpoint
        const programsResponse = await fetch(`${apiUrl}/allprograms`);
        
        if (!programsResponse.ok) {
          throw new Error('Failed to fetch programs');
        }
        
        const programsData = await programsResponse.json();
        console.log("Fetched programs:", programsData);
        setAllPrograms(programsData);
        
        // Only fetch enrolled programs if user is authenticated
        if (isAuthenticated()) {
          const token = localStorage.getItem("token");
          const enrollmentResponse = await fetch(`${apiUrl}/user/my-programs`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (enrollmentResponse.ok) {
            const data = await enrollmentResponse.json();
            const enrolledProgramIds = data.programs?.map(program => program.programId) || [];
            setEnrolledPrograms(enrolledProgramIds);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        
        // Uncomment below if you want fallback data
        // console.log("Using fallback static data");
        // setAllPrograms(programsData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleProgramClick = (programId, mongoId) => {
    if (!isAuthenticated()) {
      // If not authenticated, redirect to login
      navigate('/login');
      return;
    }
    
    // Check if program is in enrolled programs list
    if (enrolledPrograms.includes(programId)) {
      navigate(`/program-details-active/${mongoId}`);
    } else {
      navigate(`/program-details-inactives/${mongoId}`);
    }
  };

  if (loading) return (
    <section className="py-10 px-4 text-center">
      <h2 className="text-xl font-bold">Loading programs...</h2>
    </section>
  );

  if (error) return (
    <section className="py-10 px-4 text-center">
      <h2 className="text-xl font-bold text-red-600">Error loading programs</h2>
      <p className="mt-2 text-gray-600">Please try again later</p>
    </section>
  );

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <h2 className="text-center font-bold text-xl sm:text-2xl lg:text-3xl text-[#202124]">
        Our Minor Programs
      </h2>
      <p className="text-xs sm:text-sm text-center mt-1 mb-6 leading-snug text-[#6d6d6d] max-w-3xl mx-auto">
        Join the innovative Minor Certificate program, proudly backed by IIT Mandi, NSDC
      </p>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {allPrograms.length > 0 ? (
          allPrograms.map((program) => (
          <article
            key={program.programId}
              className="relative bg-[#f9f4ff] border border-[#e8dcf8] rounded-lg p-4 overflow-hidden"
          >
              <h3 className="font-semibold text-base text-[#202124]">
              {program.programName}
            </h3>
              <p className="text-xs mt-1 mb-3 text-[#454545] pr-4">
              {program.detail}
            </p>

              <div className="flex items-center gap-4 text-xs font-medium text-[#6d6d6d]">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                  {program.semesterCount ? `${program.semesterCount} Semesters` : '3 Semesters'}
              </span>
              <span className="flex items-center gap-1">
                <Globe size={14} />
                Online
              </span>
            </div>

              <button
                onClick={() => handleProgramClick(program.programId, program._id)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#f0e6ff] transition-colors"
                aria-label="View program details"
              >
                <ArrowRight size={18} className="text-[#704ee7]" />
              </button>
          </article>
          ))
        ) : (
          <p className="text-center text-gray-500">No programs available at the moment.</p>
        )}
      </div>
    </section>
  );
}
