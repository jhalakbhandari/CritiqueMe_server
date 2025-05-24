import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔐 Serialize/Deserialize
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// 🧾 Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password)
          return done(null, false, { message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "Invalid credentials" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 🌐 Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const existingUser = await prisma.user.findFirst({
          where: { provider: "google", providerId: profile.id },
        });

        if (existingUser) return done(null, existingUser);

        const newUser = await prisma.user.create({
          data: {
            email: profile.emails?.[0].value || "",
            name: profile.displayName,
            provider: "google",
            providerId: profile.id,
          },
        });

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);
export default passport;
