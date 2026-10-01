import Razorpay from "razorpay";

console.log("Razorpay env check:", {
    keyIdPresent: Boolean(process.env.RAZORPAY_KEY_ID),
    keySecretPresent: Boolean(process.env.RAZORPAY_KEY_SECRET)
});

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export default razorpay;