const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class Customer {
  private name: string;
  private email: string;
  private phone: string;

  constructor(name: string, email: string, phone: string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  async createCustomer() {
    return await createCustomer(this.name, this.email, this.phone)
      .then((response) => {
        return {
          ok: true,
          response: response.id,
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

const createCustomer = async (name: string, email: string, phone: string) =>
  await stripe.customers.create({
    name,
    email,
    phone,
  });

export default Customer;
