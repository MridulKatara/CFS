import React from "react";
import Instructor from '../assets/instructor.png';
import ChatGPT from '../assets/t1.png';
import Plotly from '../assets/t2.png';
import NumPy from '../assets/t3.png';
import Spacy from '../assets/t4.jpg';
import Matplotlib from '../assets/t5.png';
import OpenCV from '../assets/t6.png';
import Faculty from '../assets/faculty.png';
import BottomNavBar from './ButtomNavItem';
import { useNavigate } from "react-router-dom";

const ProgramDetailsInactives = () => {
	const navigate = useNavigate();

	const handleRegisterClick = () => {
		navigate('/payment', { state: { registration: true } });
	};

	return (
		<div className="min-h-screen bg-white pb-20 flex flex-col">
			<div className="max-w-[375px] mx-auto min-h-screen bg-white flex flex-col flex-1 overflow-y-auto">
				<div className="flex items-center justify-between px-4 mt-4 mb-6">
					<h1 className="text-2xl font-semibold text-black font-poppins">Program Details</h1>
					<div className="w-8 h-8 invisible">
						<img className="w-full h-full" alt="" src="arrow_right_alt.svg" />
					</div>
				</div>
	
				<div className="flex-1 px-4 pb-32">
					{/* Program Info */}
					<div className="mb-6">
						<h2 className="text-xl font-medium text-black mb-2">Minor in Business Analytics</h2>
						<p className="text-xs text-darkslategray mb-4">
							A comprehensive program introducing students to computer science fundamentals and software engineering principles.
						</p>
					</div>
					{/* Highlight Card */}
					<div className="flex items-center gap-3 mb-4 rounded-xl border border-whitesmoke-300 overflow-hidden">
						<div className="h-[72px] bg-[#704ee7] flex items-center justify-center px-4">
							<b className="text-white text-2xl">80%</b>
						</div>
						<div className="flex-1 py-3 pr-3">
							<p className="text-xs text-dimgray font-medium">
								of emerging roles in India by 2026 will require CSE-related skills
							</p>
						</div>
					</div>
					{/* Quote Card */}
					<div className="flex items-center gap-3 mb-6 rounded-xl border border-whitesmoke-300">
						<img className="w-[69px] h-[69px] rounded-xl" alt="" src={Faculty} />
						<div className="flex-1">
							<p className="text-xs text-dimgray">
								<i className="font-medium">It is not about man versus machine anymore. It is about man with machine versus man without.</i>
							</p>
						</div>
					</div>
					{/* Duration */}
					<div className="mb-6">
						<h3 className="text-sm font-medium mb-2">Duration</h3>
						<p className="text-xs text-darkslategray">3 Semester</p>
					</div>
					{/* Course Fee */}
					<div className="mb-6">
						<h3 className="text-sm font-medium text-black mb-2">Course Fee</h3>
						<p className="text-xs text-darkslategray mb-2">₹45000 (₹15000 per semester)</p>
						<div className="rounded-2xl bg-[#f7f7f7] p-3">
							<div className="flex justify-between">
								<div className="space-y-2 text-xs text-darkslategray">
									<p>Registration Fee</p>
									<p>1st Semester</p>
									<p>2nd Semester</p>
									<p>3rd Semester</p>
								</div>
								<div className="space-y-2 text-xs text-darkslategray">
									<p><span>- </span><span className="text-[#008000]">Paid</span></p>
									<p><span>- </span><span className="font-medium">₹14,000</span></p>
									<p><span>- </span><span className="font-medium">₹15,000</span></p>
									<p><span>- </span><span className="font-medium">₹15,000</span></p>
								</div>
							</div>
						</div>
					</div>
					{/* Eligibility */}
					<div className="mb-6">
						<h3 className="text-sm font-medium mb-2">Eligibility</h3>
						<p className="text-xs text-darkslategray">
							Open to students from all engineering disciplines with a minimum CGPA of 8.0
						</p>
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
					<div className="mb-6">
						<h3 className="text-sm font-medium mb-4">Faculty</h3>
						<div className="space-y-3">
							{['Dr. Indu Joshi', 'Dr. Adarsh Patel', 'Dr. Sneha Singh'].map((name) => (
								<div key={name} className="flex items-center gap-3 p-3 rounded-3xl border border-whitesmoke-200">
									<img className="w-14 h-14 rounded-[12.8px] object-cover" alt={name} src={Instructor} />
									<div>
										<h4 className="text-sm font-medium text-black">{name}</h4>
										<p className="text-xs text-darkslategray">Associate Professor</p>
										<p className="text-xs font-medium text-darkslategray">IIT Mandi</p>
									</div>
								</div>
							))}
						</div>
					</div>
					{/* Bottom Action Bar */}
					<div className="mb-6">
						<button
							className="w-full rounded-lg bg-gradient-to-r from-mediumslateblue to-[#5f39e4] py-2.5 px-5 text-white font-poppins font-semibold"
							onClick={handleRegisterClick}
						>
							Pay ₹1000 & Register Now
						</button>
					</div>
				</div>
			</div>
			<BottomNavBar />
		</div>
	);
};

export default ProgramDetailsInactives;
