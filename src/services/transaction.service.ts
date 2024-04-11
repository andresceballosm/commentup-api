import moment from "moment";
import { ITransaction, Transaction } from "../models/transaction.model";
import { IUser } from "../models/user.model";

export async function CreateTransactionService(data: ITransaction) {
  try {
    const transaction = new Transaction(data);
    await transaction.save();
    return {
      ok: true,
      response: transaction,
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-create-transaction-db",
        msg: error,
      },
    };
  }
}

// export async function GetTransactionsForBillService(user: IUser) {
//   try {
//     const request = await Transaction.find({ userID: user.id });
//     // const month =
//     //   new Date().getDate() > user.cutOffDate
//     //     ? new Date().getMonth() + 1
//     //     : new Date().getMonth();
//     // const year =
//     //   new Date().getMonth() === 11
//     //     ? new Date().getDate() > user.cutOffDate
//     //       ? new Date().getFullYear()
//     //       : new Date().getFullYear() + 1
//     //     : new Date().getFullYear();
//     // const cutOffDate = month + "/" + user.cutOffDate + "/" + year;

//     // const monthFromBill =
//     //   new Date().getMonth() === 0 ? 12 : new Date().getMonth();

//     // const yearFromBill =
//     //   new Date().getMonth() === 0
//     //     ? new Date().getFullYear() - 1
//     //     : new Date().getFullYear();
//     // const from = new Date(
//     //   yearFromBill + "/" + monthFromBill + "/" + user.cutOffDate,
//     // );

//     const transactionPending = request.filter(
//       (transaction: ITransaction) =>
//         //@ts-ignore
//         moment(transaction.createdAt).format("MMM Do YY") <=  moment(cutOffDate).format("MMM Do YY") &&
//         //@ts-ignore
//         moment(transaction.createdAt).format("MMM Do YY") >= moment(from).format("MMM Do YY"),
//     );
//     let totalTokens = 0;
//     let totalPricing = 0;
//     transactionPending.map((transaction: ITransaction) => {
//       totalTokens += transaction.tokens;
//       totalPricing += transaction.pricing;
//       return transaction;
//     });

//     // const from = month + "/" + user.cutOffDate + "/" + year;
//     const to = new Date(year + "/" + month + "/" + user.cutOffDate);
//     const interval =
//       moment(from).format("MMM Do YY") +
//       " - " +
//       moment(cutOffDate).format("MMM Do YY");
//     return {
//       ok: true,
//       response: {
//         transactions: transactionPending,
//         balance: {
//           total: totalPricing.toFixed(2),
//           tokens: totalTokens,
//           from,
//           to,
//           interval,
//         },
//       },
//     };
//   } catch (error) {
//     console.log("error ", error);
//     return {
//       ok: false,
//       response: {
//         transactions: [],
//         balance: {
//           total: 0,
//           tokens: 0,
//           from: new Date(),
//           to: new Date(),
//           interval: "",
//         },
//       },
//     };
//   }
// }
