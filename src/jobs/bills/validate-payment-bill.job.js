const moment = require("moment");
const { statusType } = require("../../constants/bill.constants");
const { User } = require("../../models/user.model");
const { connectDB } = require("../../config/db.config");
const { Bill } = require("../../models/bill.model");

const ValidatePaymentBill = async () => {
  try {
    console.log("llegaaa ");
    await connectDB();
    const users = await User.find();
    for (const user of users) {
      const bills = await Bill.find({ userID: user.id });
      if (bills.length === 0) {
        continue;
      }

      const pendingBill = bills.find((bill) => bill.status === statusType[0]);
      const due = moment(new Date(pendingBill.due)).format("YYYY/MM/DD");
      const today = moment(new Date()).format("YYYY/MM/DD");
      if (pendingBill && due <= today) {
        await Bill.findByIdAndUpdate(
          pendingBill._id,
          { status: statusType[1] },
          {
            upsert: true,
          },
        );
      }
    }
  } catch (error) {
    console.log("error ", error);
  }
};

ValidatePaymentBill();
