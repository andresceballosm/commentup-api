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

class PaymentModel {
  private amount: number;
  private currency: string;
  private customer?: any;
  private source: any;
  private description: string;

  constructor(
    amount: number,
    currency: string,
    customer: any,
    CardID: string,
    description: string,
  ) {
    this.amount = amount;
    this.currency = currency;
    this.description = description;
    this.customer = customer || "";
    this.source = CardID;
  }
  async createPayment() {
    console.log("AMOUNT ", this.amount, this.currency);
    return await createPayment(
      this.amount,
      this.currency,
      this.customer,
      this.source,
      this.description,
    )
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

const createPayment = async (
  amount: number,
  currency: string,
  customer: ICustomer,
  source: any,
  description: string,
) =>
  await stripe.charges.create({
    amount,
    currency,
    customer,
    source,
    description,
  });

export default PaymentModel;
