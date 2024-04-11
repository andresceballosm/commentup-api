const moment = require("moment");
const { User } = require("../../models/user.model");
const { connectDB } = require("../../config/db.config");
const { Bill } = require("../../models/bill.model");
const {
  GetTransactionsForBillService,
} = require("../../services/transaction.service");

const GenerateBill = async () => {
  // await connectDB();
  // const users = await User.find();
  // const day = new Date().getDate();
  // for (const user of users) {
  //   const month = new Date().getMonth() + 1;
  //   const year = new Date().getFullYear();
  //   const cutOffDateThisMonth = new Date(
  //     year + "/" + month + "/" + user.cutOffDate,
  //   );
  //   const dayCut = moment(cutOffDateThisMonth)
  //     .add(1, "days")
  //     .toDate();
  //   if (day === dayCut.getDate()) {
  //     const bills = await Bill.find({ userID: user.id });
  //     const transactions = await GetTransactionsForBillService(user);
  //     if (transactions?.ok) {
  //       const { total, to, from, tokens } = transactions.response.balance;
  //       const existBill = bills.find(
  //         (bill) => new Date(bill.from).getMonth() === from.getMonth(),
  //       );
  //       if (!existBill && total >= 1) {
  //         const data = {
  //           from,
  //           to,
  //           pricing: total,
  //           tokens,
  //           userID: user.id,
  //         };
  //         const bill = new Bill(data);
  //         await bill.save();
  //       }
  //     }
  //   }
  // }
};

GenerateBill();
