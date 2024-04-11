import e, { Response, NextFunction } from "express";
import moment from "moment";
import { TITLE_ERROR } from "../constants/messages.constants";
import { ITransaction, Transaction } from "../models/transaction.model";

export async function create(req: any, res: Response) {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();

    return res.status(200).send({
      ok: true,
      message: null,
      response: {
        transaction,
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

export async function getTransactions(req: any, res: Response) {
  try {
    const request = await Transaction.find({ userID: req.user.id });
    const month =
      new Date().getDate() > req.user.cutOffDate
        ? new Date().getMonth() + 1
        : new Date().getMonth();
    const year =
      new Date().getMonth() === 11
        ? new Date().getDate() > req.user.cutOffDate
          ? new Date().getFullYear()
          : new Date().getFullYear() + 1
        : new Date().getFullYear();
    const cutOffDate = month + "/" + req.user.cutOffDate + "/" + year;
    const transactionsCurrentCutOfDate = request.filter(
      (transaction: ITransaction) =>
        //@ts-ignore
        new Date(transaction.createdAt) > new Date(cutOffDate),
    );
    let totalTokens = 0;
    transactionsCurrentCutOfDate.map((transaction: ITransaction) => {
      totalTokens += transaction.tokens;
      return transaction;
    });

    const totalPricing = totalTokens * req.user.pricing;
    const from = month + "/" + req.user.cutOffDate + "/" + year;
    const to = month + 1 + "/" + req.user.cutOffDate + "/" + year;
    const interval =
      moment(from).format("MMM Do YY") +
      " - " +
      moment(to).format("MMM Do YY");
    return res.status(200).send({
      ok: true,
      response: {
        transactions: transactionsCurrentCutOfDate,
        balance: {
          total: totalPricing.toFixed(5),
          tokens: totalTokens,
          interval,
        },
      },
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}
