const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["openid", "profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [{ email: profile.emails[0].value }, { googleId: profile.id }],
        });

        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: profile.id,
            googleId: profile.id,
            profilePicture:
              profile.photos[0]?.value || "https://via.placeholder.com/150",
            role: "customer",
            isVerified: true,
          });
          await user.save();
          console.log(`New user created: ${user.email}`);
        } else {
          user.name = profile.displayName;
          user.profilePicture = profile.photos[0]?.value || user.profilePicture;
          await user.save();
          console.log(`Existing user updated: ${user.email}`);
        }

        done(null, user);
      } catch (error) {
        console.error("Error in Google OAuth:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
