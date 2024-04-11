const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export interface IAction {
  say: string;
  redirect?: string;
}

export const sendSmsWhatsAppService = async (
  to: string,
  from: string,
  message: string,
  withWhatsApp = false,
  media = null,
  actions: IAction[] = [],
) => {
  try {
    const fromFormat = withWhatsApp ? `whatsapp:${from}` : from;
    const toFormat = withWhatsApp ? `whatsapp:${to}` : to;

    const content = {
      body: message,
      from: fromFormat,
      to: toFormat,
    };

    if (actions.length > 0) {
      Object.assign(content, {
        actions,
      });
    }

    if (media) {
      Object.assign(content, {
        media,
      });
    }

    const request = await client.messages.create(content);

    console.log("request send message twilio=== ", request);

    return {
      error: false,
      response: "Felicidades",
    };
  } catch (error) {
    return {
      error: true,
      message: {
        title: "Error",
        message: error,
      },
    };
  }
};
