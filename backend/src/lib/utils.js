import jwt from 'jsonwebtoken'; // Importing jwt for token generation

export const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expiration time
    });
    res.cookie("jwt", token, {
        httpOnly: true, // Helps prevent XSS attacks
        sameSite: "lax",
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration time (30 days)
    });
    return token;
};
