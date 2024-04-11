const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export interface ICustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  metadata?: any;
  shipping?: any;
  address?: any;
  description?: string;
}

class CreditCard {
  private stripetoken: string;
  private customer: ICustomer;

  constructor(stripetoken: string, customer: ICustomer) {
    this.stripetoken = stripetoken;
    this.customer = customer;
  }

  async saveCreditCard() {
    return await saveCreditCard(this.stripetoken, this.customer)
      .then((response) => {
        return {
          ok: true,
          response: response,
        };
      })
      .catch((err) => {
        return {
          ok: false,
          response: err,
        };
      });
  }
  async deleteCreditCard() {
    return await deleteCreditCard(this.stripetoken, this.customer)
      .then((response) => {
        return {
          ok: true,
          response: response,
        };
      })
      .catch((err) => {
        return {
          ok: false,
          response: err,
        };
      });
  }
  async selectCreditCard() {
    return await updateDefaultCard(this.stripetoken, this.customer)
      .then((response) => {
        return {
          ok: true,
          response: response,
        };
      })
      .catch((err) => {
        return {
          ok: false,
          response: err,
        };
      });
  }
}

const saveCreditCard = async (stripetoken: string, customer: ICustomer) =>
  await stripe.customers.createSource(customer, { source: stripetoken });

const deleteCreditCard = async (stripetoken: string, customer: ICustomer) =>
  await stripe.customers.deleteSource(customer, stripetoken);

const updateDefaultCard = async (stripetoken: string, customer: ICustomer) =>
  await stripe.customers.update(customer, {
    invoice_settings: {
      default_payment_method: stripetoken,
    },
  });

export default CreditCard;
