import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import paymentsData from '../data/payments.json';
import BottomNavBar from './ButtomNavItem';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [payments, setPayments] = useState(paymentsData);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleSelectCourseClick = () => {
        navigate('/my-program');
    };

    // Registration payment UI
    if (location.state && location.state.registration) {
        const handlePay = () => {
            // Simulate payment and add to payment history
            setPayments([
                ...payments,
                {
                    id: String(payments.length + 1),
                    programName: "Minor in Business Analytics",
                    description: "Registration fee for Minor in Business Analytics",
                    amount: 1000,
                    status: "Completed",
                    date: new Date().toISOString()
                }
            ]);
            // After payment, redirect to payment history
            navigate('/payment', { replace: true });
        };

        return (
            <div className="w-full min-h-screen bg-[#f5f5f5] flex flex-col pb-20">
                <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
                    <div className="w-full max-w-[375px] mx-auto px-4 pt-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <button className="w-8 h-8" onClick={handleBackClick}>
                                <FiArrowLeft className="w-6 h-6" />
                            </button>
                            <div className="text-2xl font-semibold flex-1 text-center">Book your Seat</div>
                            <div className="w-8 h-8" />
                        </div>
                        {/* Info */}
                        <div className="mb-8 text-xs text-darkslategray text-center">
                            Secure your seat now by paying a one-time registration fee of just ₹1,000.
                        </div>
                        {/* Payment Card */}
                        <div className="rounded-[234px] bg-gradient-to-b from-[#dbd2f9] to-[#f5f5f5] border border-gray-400 flex flex-col items-center justify-center py-6 px-12 text-xs text-darkslategray mb-8">
                            <div className="font-medium mb-2">Pay Registration Fee</div>
                            <div className="text-[32px] font-bold bg-gradient-to-r from-[#704ee7] to-[#5f39e4] bg-clip-text text-transparent">₹ 1000</div>
                        </div>
                        {/* Terms */}
                        <div className="text-xs text-dimgray mb-8">
                            By proceeding, I agree to <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>
                        </div>
                        {/* Pay Button */}
                        <button
                            className="w-full rounded-lg bg-gradient-to-r from-[#704ee7] to-[#5f39e4] py-2.5 px-5 text-white font-semibold mb-8"
                            onClick={handlePay}
                        >
                            Pay ₹1000
                        </button>
                    </div>
                </div>
                <BottomNavBar />
            </div>
        );
    }

    // Payment history or empty state
    return (
        <div className="w-full min-h-screen bg-[#f5f5f5] flex flex-col pb-20">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-4 py-5 flex items-center">
                <button 
                    onClick={handleBackClick}
                    className="w-8 h-8 flex items-center justify-center"
                >
                    <FiArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-[#202124] text-2xl font-semibold flex-1 text-center">Payment History</h1>
                <div className="w-8 h-8"></div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
                {payments.length > 0 ? (
                    <div className="space-y-4">
                        {payments.map((payment) => (
                            <div key={payment.id} className="bg-white rounded-2xl p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-base font-medium text-[#202124]">
                                        {payment.programName}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                                        payment.status === 'Completed' 
                                            ? 'text-[#0cc85c] bg-[#0cc85c]/10' 
                                            : payment.status === 'Pending'
                                            ? 'text-[#d48b06] bg-[#d48b06]/10'
                                            : 'text-red-500 bg-red-500/10'
                                    }`}>
                                        {payment.status}
                                    </span>
                                </div>
                                <p className="text-xs text-[#454545] mb-2">
                                    {payment.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-[#202124]">
                                        ₹{payment.amount}
                                    </span>
                                    <span className="text-xs text-[#454545]">
                                        {new Date(payment.date).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-[#202124] mb-2">No Payment History</h3>
                        <p className="text-sm text-[#454545] mb-6">
                            You haven't made any payments yet. Select a course to get started.
                        </p>
                        <button
                            onClick={handleSelectCourseClick}
                            className="inline-flex items-center gap-2 bg-[#704ee7] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5f39e4] transition-colors"
                        >
                            Select Course to Study
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            <BottomNavBar />
        </div>
    );
};

export default Payment;
