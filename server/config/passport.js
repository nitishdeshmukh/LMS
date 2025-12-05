import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Student } from "../models/index.js";

const configurePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                // callbackURL:"https://server-production-bf4c.up.railway.app/api/auth/google/callback",
                callbackURL: `${process.env.SERVER_URI}/api/auth/google/callback`,
                // http://localhost:5001/api/auth/google/callback
            },
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    let student = await Student.findOneAndUpdate(
                        { googleId: profile.id },
                        { new: true }
                    );

                    if (!student) {
                        student = await Student.create({
                            googleId: profile.id,
                            name: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails?.[0]?.value,
                            avatar: profile.photos?.[0]?.value,
                        });
                    }

                    return cb(null, student);
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
                // callbackURL:"https://server-production-bf4c.up.railway.app/api/auth/github/callback",
                callbackURL: `${process.env.SERVER_URI}/api/auth/github/callback`,
            },
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    let student = await Student.findOneAndUpdate(
                        { githubId: profile.id },
                        { new: true }
                    );

                    if (!student) {
                        student = await Student.create({
                            githubId: profile.id,
                            name: profile.displayName.split(" ")[0],
                            lastName: profile.displayName.split(" ")[1],
                            email: profile.emails?.[0]?.value,
                            avatar: profile.photos?.[0]?.value,
                        });
                    }

                    return cb(null, student);
                } catch (error) {
                    return cb(error, null);
                }
            }
        )
    );
};

export default configurePassport;
