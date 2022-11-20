import express from "express"
import passport from "passport";
import {User} from "../src/models/User.js"
import {getDateId} from "./datos.js"
import { Strategy } from "passport-local";
import cookieParser from "cookie-parser";
import session from "express-session"
import bcrypt from "bcrypt"

const LocalStrategy = Strategy;
const app = express();

app.use(cookieParser());
app.use(
    session({
      secret: "1234567890!@#$%^&*()",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 100000, 
      },
    })
  );

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

passport.use(new LocalStrategy({ usernameField: 'email',passwordField: 'password'},function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
    if (err) console.log(err);
    if (!user) return done(null, false);

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }));

passport.serializeUser((user, done) => {

  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id).lean();
  return done(null, user);
});

export {app, passport}