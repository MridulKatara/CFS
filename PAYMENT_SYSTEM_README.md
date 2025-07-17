# Payment System Implementation

This document describes the payment system implementation with file upload functionality for the CFS (College Fee System) application.

## Features Implemented

### 1. Payment Flow
- **Online Payment**: Users can pay ₹1000 registration fee through Razorpay
- **Manual Upload**: Users can upload payment receipts if they've already paid to the college
- **File Upload**: Support for PDF and image files (max 5MB)
- **S3 Storage**: Files are uploaded to AWS S3 for secure storage
- **Admin Verification**: Admins can verify uploaded payment receipts

### 2. Backend Implementation

#### New Files Created:
- `server/utils/s3Utils.ts` - S3 file upload utilities
- `server/middleware/upload.ts` - Multer middleware for file handling
- `server/controllers/paymentController.ts` - Enhanced with file upload functionality
- `server/models/Payment.ts` - Updated with file upload fields

#### Updated Files:
- `server/package.json` - Added dependencies: `uuid`, `multer`
- `server/routes/user.ts` - Added payment upload and history endpoints
- `server/routes/adminRoutes.ts` - Added payment verification endpoints
- `server/controllers/adminController.ts` - Added payment verification functions

#### New API Endpoints:

**User Endpoints:**
- `POST /user/payment/upload-receipt` - Upload payment receipt
- `GET /user/payment/history` - Get payment history

**Admin Endpoints:**
- `GET /admin/payments/pending` - Get pending payment verifications
- `POST /admin/payments/verify` - Verify or reject payment

### 3. Frontend Implementation

#### New Files Created:
- `frontend/src/admin/PaymentVerification.jsx` - Admin interface for payment verification

#### Updated Files:
- `frontend/src/student/Payment.jsx` - Enhanced with file upload functionality
- `frontend/src/services/api.js` - Added payment-related API methods
- `frontend/src/admin/AdminNavBar.jsx` - Added payment verification navigation
- `frontend/src/App.jsx` - Added payment verification route

### 4. Payment Flow

1. **User clicks "Pay ₹1000"** on a program
2. **Payment page opens** with two options:
   - Pay Online (Razorpay integration)
   - Upload Payment Receipt (for manual payments)
3. **File Upload Process**:
   - User selects PDF or image file
   - File is validated (type and size)
   - File is converted to base64 and sent to backend
   - Backend uploads file to S3
   - Payment record is created with "pending_verification" status
   - User is enrolled in the program
4. **Admin Verification**:
   - Admin can view pending payments in admin panel
   - Admin can approve or reject payment receipts
   - Payment status is updated accordingly

### 5. Environment Variables Required

Add these to your `.env` file:

```env
# AWS Configuration for S3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET_NAME=cfs-payment-receipts

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

### 6. Database Schema Updates

The Payment model now includes:
- `receiptFile`: Object containing file URL, S3 key, original name, and upload date
- `paymentMethod`: Either 'razorpay' or 'manual_upload'
- `verified`: Boolean indicating if payment is verified
- `verifiedAt`: Date when payment was verified
- `verifiedBy`: Admin user who verified the payment
- `status`: Can be 'created', 'paid', 'failed', or 'pending_verification'

### 7. File Upload Specifications

- **Supported Formats**: Images (JPEG, PNG, GIF, etc.) and PDF files
- **Maximum Size**: 5MB
- **Storage**: AWS S3 with public read access
- **File Naming**: UUID-based naming for security
- **Organization**: Files stored in `payments/{userId}/{programId}/` structure

### 8. Security Features

- File type validation (images and PDFs only)
- File size limits (5MB max)
- UUID-based file naming to prevent conflicts
- S3 bucket with proper access controls
- Admin-only payment verification
- Base64 encoding for secure file transfer

### 9. User Experience

- **File Preview**: Image files show preview before upload
- **Progress Indicators**: Loading states during upload and verification
- **Error Handling**: Clear error messages for validation failures
- **Success Feedback**: Confirmation messages and automatic redirects
- **Payment History**: Users can view all their payment records

### 10. Admin Experience

- **Pending Payments Dashboard**: View all pending verifications
- **File Access**: Direct links to view uploaded receipts
- **Bulk Actions**: Approve or reject payments with one click
- **User Information**: Display user details with each payment
- **Real-time Updates**: List refreshes after verification actions

## Installation and Setup

1. Install backend dependencies:
   ```bash
   cd CFS/server
   bun install
   ```

2. Set up environment variables in `.env` file

3. Create S3 bucket and configure AWS credentials

4. Start the backend server:
   ```bash
   bun run dev
   ```

5. The frontend already has the required dependencies installed

## Usage

1. **For Students**:
   - Navigate to a program and click "Pay ₹1000"
   - Choose payment method (online or upload receipt)
   - Upload file if choosing manual upload
   - Wait for admin verification

2. **For Admins**:
   - Navigate to Admin Panel → Payments
   - Review pending payment receipts
   - Click "Approve" or "Reject" for each payment
   - Monitor payment verification status

## Future Enhancements

- Email notifications for payment verification status
- Bulk payment verification
- Payment receipt download functionality
- Advanced file validation (OCR for receipt data extraction)
- Payment analytics and reporting
- Integration with college ERP systems 