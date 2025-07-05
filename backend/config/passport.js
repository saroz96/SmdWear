// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const User = require('../models/User');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// // Local strategy for username/password
// passport.use(new LocalStrategy(
//   { usernameField: 'email' },
//   async (email, password, done) => {
//     try {
//       const user = await User.findOne({ email });
//       if (!user) return done(null, false, { message: 'Invalid Username & Password.' });

//       const isMatch = await user.comparePassword(password);
//       if (!isMatch) return done(null, false, { message: 'Invalid Username & Password.' });

//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   }
// ));

// // JWT strategy for protected routes
// const jwtOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.JWT_SECRET
// };

// passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
//   try {
//     const user = await User.findById(payload.id);
//     if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   } catch (err) {
//     return done(err, false);
//   }
// }));

// Generate JWT token
exports.generateToken = (user) => {
  return jwt.sign({
    id: user._id,
    email: user.email,
    role: user.role
  }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Local Strategy for username/password
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase().trim() });

      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialization
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});