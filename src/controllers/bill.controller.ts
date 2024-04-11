import { Response } from "express";
import { statusType } from "../constants/bill.constants";
import { TITLE_ERROR } from "../constants/messages.constants";
import { Bill } from "../models/bill.model";
import PaymentModel from "../models/payment.model";
import {
  validateBills,
  validatePaymentBill,
} from "../validations/bills.validation";

export async function create(req: any, res: Response) {
  try {
    const validation = validateBills(req);
    if (validation.err) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: validation.message,
          code: "app-missing-fields",
        },
      });
    }
    const bill = new Bill(req.body);
    await bill.save();
    return res.status(200).send({
      ok: true,
      message: null,
      response: {
        bill,
      },
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).send({
      error: false,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function get(req: any, res: Response) {
  try {
    const bills = await Bill.find({ userID: req.user.id });

    return res.status(200).send({
      ok: true,
      message: null,
      response: {
        bills,
      },
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).send({
      error: false,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function paymentBill(req: any, res: Response) {
  try {
    const validation = validatePaymentBill(req);
    if (validation.err) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: validation.message,
          code: "app-missing-fields",
        },
      });
    }

    const { amount, customer, cardID, billID } = req.body;
    const payment = new PaymentModel(
      parseFloat(amount) * 100,
      "usd",
      customer,
      cardID,
      `Payment bill ${billID}`,
    );

    const responsePayment = await payment.createPayment();

    if (!responsePayment.ok) {
      return res.status(400).send({
        ok: false,
        message: {
          message: "failed-payment",
        },
        response: responsePayment.response,
      });
    }

    await Bill.findByIdAndUpdate(
      billID,
      { status: statusType[2] },
      {
        upsert: true,
      },
    );

    const bills = await Bill.find({ userID: req.user.id });
    return res.status(200).send({
      ok: true,
      message: {
        message: "payment-successfully",
      },
      response: { bills },
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).send({
      error: false,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}
