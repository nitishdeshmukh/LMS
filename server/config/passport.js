import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
// import User from "../models/User.js";
import { User } from "../models/index.js";

const configurePassport = () => {
    console.log(process.env.GOOGLE_CLIENT_ID);

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/api/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, cb) => {
                console.log(profile);

                try {
                    let user = await User.findOneAndUpdate(
                        { googleId: profile.id },
                        { isLoggedIn: true },
                        { new: true }
                    );

                    if (!user) {
                        user = await User.create({
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails?.[0]?.value,
                            avatar: profile.photos?.[0]?.value,
                            isLoggedIn: true,
                            isVerified: true,
                        });
                    }

                    return cb(null, user);
                } catch (error) {
                    return cb(error, null);
                }
            }
        )
    );

    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: "/api/auth/github/callback",
            },
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    let user = await User.findOneAndUpdate(
                        { githubId: profile.id },
                        { isLoggedIn: true },
                        { new: true }
                    );

                    if (!user) {
                        user = await User.create({
                            githubId: profile.id,
                            name: profile.displayName,
                            email: profile.emails?.[0]?.value,
                            avatar: profile.photos?.[0]?.value,
                            isLoggedIn: true,
                            isVerified: true,
                        });
                    }

                    return cb(null, user);
                } catch (error) {
                    return cb(error, null);
                }
            }
        )
    );
};

export default configurePassport;
