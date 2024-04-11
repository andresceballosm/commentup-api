import { Request } from "express";

export const validateBills = (req: Request) => {
  const { from, to, userID, pricing, tokens } = req.body;

  let error = "Missing: ";

  if (!from) {
    error += "from, ";
  }

  if (!to) {
    error += "to, ";
  }

  if (!userID) {
    error += "userID, ";
  }

  if (!pricing) {
    error += "pricing, ";
  }
  if (!tokens) {
    error += "tokens, ";
  }

  return {
    err: error.length > 9,
    message: error,
  };
};

export const validatePaymentBill = (req: Request) => {
  const { amount, currency, description, customer, cardID, billID } = req.body;

  let error = "Missing: ";

  if (!amount) {
    error += "amount, ";
  }

  if (!description) {
    error += "description, ";
  }

  if (!customer) {
    error += "customer, ";
  }

  if (!cardID) {
    error += "cardID, ";
  }

  if (!billID) {
    error += "billID, ";
  }

  return {
    err: error.length > 9,
    message: error,
  };
};
