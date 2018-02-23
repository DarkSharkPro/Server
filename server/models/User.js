import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';
import crypto from 'crypto';

mongoose.Promise = Promise;

const { Schema } = mongoose;
mongoose.Types.ObjectId.isValid();

const userSchema = new Schema({
  username: {
    type: String,
    unique: 'The username "{VALUE}" is already taken',
    required: true,
  },
  email: {
    type: String,
    unique: 'The email "{VALUE}" is already taken',
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(beautifyUnique);

// encryption
userSchema.methods.encryptPassword = function (password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha256');
};

userSchema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    this.salt = crypto.randomBytes(128).toString('base64');
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  return this.encryptPassword(password) == this.hashedPassword;
};

const User = mongoose.model('User', userSchema);

export default User;
