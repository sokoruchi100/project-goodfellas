const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUrl = "http://localhost:5000/auth/google/callback";

// Passport serialization and deserialization
passport.serializeUser((user, done) => {
  // Serialize user data to store in the session (e.g., user ID)
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Deserialize user data from the session (e.g., retrieve user by ID)
  // In this example, we don't actually deserialize the user, but you should replace this with your user database lookup logic

  done(null, { id });
});

// Configure the Google Strategy for Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: redirectUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      // This function will be called after the Google OAuth callback
      // accessToken: Access token received from Google
      // refreshToken: Refresh token received from Google (useful for token refresh)
      // profile: User profile data returned by Google
      // done: Passport callback function to indicate success or failure

      // Here, you can handle the user data received from Google and decide whether to create a new user or log in an existing user in your application.
      // For example, you can store the user data in your database and call the done() function with the user object.

      const user = {
        id: profile.id,
        name: profile.displayName,
        email:
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : "",
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        // Add any other relevant user data from the profile
      };

      return done(null, user);
    }
  )
);

module.exports = passport;
