import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxx',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'xxxxxxxxxxxxxx',
});

export default razorpay; 