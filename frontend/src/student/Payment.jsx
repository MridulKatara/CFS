import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiFile, FiCheck, FiX } from 'react-icons/fi';
import apiService from '../services/api';
import Snackbar from '../components/Snackbar';
import BottomNavBar from './ButtomNavItem';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        if (!location.state?.registration) {
            fetchPaymentHistory();
        }
    }, [location.state]);

    const fetchPaymentHistory = async () => {
        try {
            setLoading(true);
            const response = await apiService.getPaymentHistory();
            if (response.success) {
                setPayments(response.payments || []);
            }
        } catch (error) {
            console.error('Error fetching payment history:', error);
            setSnackbar({
                message: 'Failed to load payment history',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleSelectCourseClick = () => {
        navigate('/my-program');
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
                setSnackbar({
                    message: 'Please select an image or PDF file',
                    type: 'error'
                });
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setSnackbar({
                    message: 'File size must be less than 5MB',
                    type: 'error'
                });
                return;
            }

            setSelectedFile(file);

            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => setFilePreview(e.target.result);
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setSnackbar({
                message: 'Please select a file first',
                type: 'error'
            });
            return;
        }

        try {
            setUploading(true);

            // Convert file to base64
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Data = e.target.result.split(',')[1]; // Remove data URL prefix

                const uploadData = {
                    programId: location.state?.programId,
                    type: 'enrollment',
                    amount: 1000,
                    fileData: base64Data,
                    fileName: selectedFile.name,
                    fileType: selectedFile.type
                };

                const response = await apiService.uploadPaymentReceipt(uploadData);

                if (response.success) {
                    setSnackbar({
                        message: 'Payment receipt uploaded successfully! You have been enrolled. Pending admin verification.',
                        type: 'success'
                    });

                    // Redirect to my programs after successful upload
                    setTimeout(() => {
                        navigate('/my-program');
                    }, 2000);
                }
            };
            reader.readAsDataURL(selectedFile);

        } catch (error) {
            console.error('Error uploading file:', error);
            setSnackbar({
                message: error.message || 'Failed to upload payment receipt',
                type: 'error'
            });
        } finally {
            setUploading(false);
        }
    };

    const handlePayOnline = async () => {
        try {
            setLoading(true);
            
            // Create payment order
            const orderData = {
                amount: 1000,
                type: 'enrollment',
                programId: location.state?.programId
            };

            const response = await apiService.createPaymentOrder(orderData);
            
            if (response.success) {
                // For now, simulate successful payment and redirect to upload
                setSnackbar({
                    message: 'Payment successful! Please upload your payment receipt.',
                    type: 'success'
                });
                
                // In a real implementation, you would integrate with Razorpay here
                // For now, we'll just show the upload form
            }
        } catch (error) {
            console.error('Error creating payment order:', error);
            setSnackbar({
                message: error.message || 'Failed to process payment',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Registration payment UI
    if (location.state && location.state.registration) {
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

                        {/* Payment Options */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 text-center">Choose Payment Method</h3>
                            
                            {/* Online Payment Option */}
                            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                                <h4 className="font-medium mb-2">Pay Online</h4>
                                <p className="text-sm text-gray-600 mb-3">Pay securely through our payment gateway</p>
                                <button
                                    className="w-full rounded-lg bg-gradient-to-r from-[#704ee7] to-[#5f39e4] py-2.5 px-5 text-white font-semibold"
                                    onClick={handlePayOnline}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Pay ₹1000 Online'}
                                </button>
                            </div>

                            {/* Manual Upload Option */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <h4 className="font-medium mb-2">Upload Payment Receipt</h4>
                                <p className="text-sm text-gray-600 mb-3">If you've already paid to the college, upload your receipt</p>
                                
                                {/* File Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <div className="text-center">
                                            <FiUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600">
                                                {selectedFile ? selectedFile.name : 'Click to select file (PDF or Image)'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                                        </div>
                                    </label>
                                </div>

                                {/* File Preview */}
                                {filePreview && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center">
                                                <FiFile className="w-5 h-5 text-gray-500 mr-2" />
                                                <span className="text-sm">{selectedFile.name}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setFilePreview(null);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FiX className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {selectedFile.type.startsWith('image/') && (
                                            <img
                                                src={filePreview}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-lg mt-2"
                                            />
                                        )}
                                    </div>
                                )}

                                <button
                                    className="w-full rounded-lg bg-green-600 py-2.5 px-5 text-white font-semibold"
                                    onClick={handleFileUpload}
                                    disabled={!selectedFile || uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Receipt'}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="text-xs text-dimgray mb-8">
                            By proceeding, I agree to <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>
                        </div>
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
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#704ee7] mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading payment history...</p>
                    </div>
                ) : payments.length > 0 ? (
                    <div className="space-y-4">
                        {payments.map((payment) => (
                            <div key={payment.id} className="bg-white rounded-2xl p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-base font-medium text-[#202124]">
                                        {payment.type === 'enrollment' ? 'Registration Fee' : `Semester ${payment.semesterName}`}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                                        payment.status === 'paid' 
                                            ? 'text-[#0cc85c] bg-[#0cc85c]/10' 
                                            : payment.status === 'pending_verification'
                                            ? 'text-[#d48b06] bg-[#d48b06]/10'
                                            : payment.status === 'created'
                                            ? 'text-blue-500 bg-blue-500/10'
                                            : 'text-red-500 bg-red-500/10'
                                    }`}>
                                        {payment.status === 'pending_verification' ? 'Pending Verification' : payment.status}
                                    </span>
                                </div>
                                <p className="text-xs text-[#454545] mb-2">
                                    {payment.paymentMethod === 'manual_upload' ? 'Manual Upload' : 'Online Payment'}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-[#202124]">
                                        ₹{payment.amount}
                                    </span>
                                    <span className="text-xs text-[#454545]">
                                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                {payment.receiptFile && (
                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                        <a
                                            href={payment.receiptFile.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-[#704ee7] hover:underline flex items-center"
                                        >
                                            <FiFile className="w-3 h-3 mr-1" />
                                            View Receipt
                                        </a>
                                    </div>
                                )}
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
            {snackbar && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={() => setSnackbar(null)}
                />
            )}
        </div>
    );
};

export default Payment;
