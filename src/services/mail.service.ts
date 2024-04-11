const sgMail = require("@sendgrid/mail");

export const sendMailService = async (
  to: string,
  subject: string,
  html: string,
  from = "team@commentup.app",
  text = "Test Email",
) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };
    const request = await sgMail.send(msg);
    return request;
  } catch (error) {
    return null;
  }
};
