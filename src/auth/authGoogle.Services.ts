
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

// Define esquema y modelo usuario
const userSchema = new mongoose.Schema({
  googleId: String,
  username: String,
  // otros campos que quieras guardar
});
userSchema.plugin(findOrCreate);
const User = mongoose.model('User', userSchema);

// Configura la estrategia Google
passport.use(new GoogleStrategy({
  clientID: 'TU_CLIENT_ID',
  clientSecret: 'TU_CLIENT_SECRET',
  callbackURL: "http://localhost:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}));

// Serializar y deserializar usuario para sesión
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
