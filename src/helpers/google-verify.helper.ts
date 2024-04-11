const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleVerify = async (token = '') => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name, picture, email } = ticket.getPayload();
  return {
    name,
    img: picture,
    email,
  };
};
