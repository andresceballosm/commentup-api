import crypto from 'crypto';
import mongoose from 'mongoose';
import moment from 'moment-timezone';

/**
 * Refresh Token Schema
 * @private
 */
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: 'String',
    ref: 'User',
    required: true,
  },
  expires: { type: Date },
});

refreshTokenSchema.statics = {

  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {Iuser} user
   * @returns {RefreshToken}
   */
  generate(user) {
    const userId = user._id;
    const userEmail = user.email;
    const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(2, 'days').toDate();
    const tokenObject = new RefreshToken({
      token, userId, userEmail, expires,
    });
    tokenObject.save();
    return tokenObject;4
  },

};

/**
 * @typedef RefreshToken
 */
// const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
// module.exports = RefreshToken;

export const RefreshToken: any = mongoose.model("RefreshToken", refreshTokenSchema);
