import React, { useState, useEffect } from 'react';
import AdminNavBar from './AdminNavBar';
import ApiService from '../services/api';
import Snackbar from '../components/Snackbar';
import { FiCheck, FiX, FiEye, FiDownload } from 'react-icons/fi';

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getPendingPayments();
      if (response.success) {
        setPayments(response.payments || []);
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      setSnackbar({
        message: 'Failed to load pending payments',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId, verified) => {
    try {
      setVerifying(true);
      const response = await ApiService.verifyAdminPayment({ paymentId, verified });
      
      if (response.success) {
        setSnackbar({
          message: response.message,
          type: 'success'
        });
        
        // Refresh the list
        await fetchPendingPayments();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setSnackbar({
        message: error.message || 'Failed to verify payment',
        type: 'error'
      });
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavBar />
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment Verification</h1>
            <p className="text-gray-600 mt-1">
              Review and verify payment receipts uploaded by students
            </p>
          </div>

          {payments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Verifications</h3>
              <p className="text-gray-600">All payment receipts have been reviewed.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Pending Verifications ({payments.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <div key={payment._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {payment.userId?.fullName || 'Unknown User'}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending Verification
                          </span>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <p><strong>Email:</strong> {payment.userId?.personalEmail}</p>
                          <p><strong>Phone:</strong> {payment.userId?.mobileNumber}</p>
                          <p><strong>Program ID:</strong> {payment.programId}</p>
                          <p><strong>Amount:</strong> ₹{payment.amount}</p>
                          <p><strong>Type:</strong> {payment.type === 'enrollment' ? 'Registration Fee' : `Semester ${payment.semesterName}`}</p>
                          <p><strong>Uploaded:</strong> {formatDate(payment.createdAt)}</p>
                          {payment.verifiedBy && (
                            <p><strong>Verified by:</strong> {payment.verifiedBy?.fullName || 'Admin'}</p>
                          )}
                        </div>

                        {payment.receiptFile && (
                          <div className="mt-4">
                            <div className="flex items-center space-x-2">
                              <FiDownload className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">Receipt:</span>
                              <a
                                href={payment.receiptFile.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                {payment.receiptFile.originalName}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="ml-6 flex space-x-2">
                        <button
                          onClick={() => handleVerifyPayment(payment._id, true)}
                          disabled={verifying}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <FiCheck className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerifyPayment(payment._id, false)}
                          disabled={verifying}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <FiX className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
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

export default PaymentVerification; 