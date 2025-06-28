const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authService = require('../services/auth.service');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await authService.findOrCreateUser(profile);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}),)

module.exports = passport;
