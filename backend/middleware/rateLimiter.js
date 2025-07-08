import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        // here we just kept it simple.
        // in your real-world app you'd like to put the user-id or ipAddress as your key
        const { success } = await ratelimit.limit("my-rate-limit");

        if (!success) {
            return res.status(429).json({message: "Too many requests, please try again later."})
        }

        next();
    } catch (err) {
        console.log("Rate Limit Error.", err);
        next(err);
    }
};

export default rateLimiter;