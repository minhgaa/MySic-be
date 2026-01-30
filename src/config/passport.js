const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authService = require('../services/auth.service');

console.log("ENV GOOGLE_CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:8080/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await authService.findOrCreateUser(profile);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}),)

module.exports = passport;
