const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SALT_ITER = 10;



const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 100
  },
  cart: {
    type: Array,
    default: []
  },
  history: {
    type: Array,
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  }

});


userSchema.pre('save', function(next) {
  const userDoc = this;

  if (userDoc.isModified('password')) {
    bcrypt.hash(userDoc.password, SALT_ITER, function(err, hash) {
      if (err) next(err);
      userDoc.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, res) {
    if (err || !res) return cb();
    return cb(null, true);
  }); 
};



userSchema.methods.generateToken = function(cb) {
  const user = this; // just for better ridding context (not wrtie this all time)
  const token = jwt.sign(user._id.toString(), process.env.SECRET);
  
  user.token = token; // it's temporary that why we must save in user on db
  user.save((err, userDoc) => {
    if (err) return cb(err);
    return cb(null, userDoc);
  })
}



userSchema.statics.findByToken = function(token, cb) {
  const user = this; // just for better ridding context (not wrtie this all time)
  
  jwt.verify(token, process.env.SECRET, (err, decode) => {
    if (err) return cb(err);
    
    user.findOne({"_id": decode, "token": token }, (err, userDoc) => {
      if (err) return cb(err);
      cb(null, userDoc);
    });
  });
}

const User = mongoose.model('User', userSchema);
module.exports = { User };