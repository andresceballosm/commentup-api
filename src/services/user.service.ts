import { IAccount, User } from "../models/user.model";

async function scan(message: string) {
  process.stdout.write(message);
  return await new Promise(function(resolve, reject) {
    process.stdin.resume();
    process.stdin.once("data", function(data) {
      process.stdin.pause();
      resolve(data.toString().trim());
    });
  });
}

export async function AddAccountService(
  id: string,
  instagramAccount: IAccount,
) {
  try {
    await User.findByIdAndUpdate(
      id,
      { $push: { accounts: instagramAccount } },
      {
        upsert: true,
      },
    );
    const user = await User.findById(id);
    return {
      ok: true,
      response: user,
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-add-instagram-account-user-db",
        msg: error,
      },
    };
  }
}

export async function UpdateAccountService(
  id: string,
  token: string,
  socialNetwork: string,
) {
  try {
    await User.findByIdAndUpdate(
      id,
      { $set: { "accounts.$[account].token": token } },
      {
        arrayFilters: [{ "account.name": socialNetwork }],
        upsert: true,
      },
    );
    const user = await User.findById(id);
    return {
      ok: true,
      response: user,
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-add-instagram-account-user-db",
        msg: error,
      },
    };
  }
}

export async function RemoveAccountService(id: string, socialName: string) {
  try {
    await User.findByIdAndUpdate(
      id,
      { $pull: { accounts: { name: socialName } } },
      {
        upsert: true,
      },
    );
    const user = await User.findById(id);
    return {
      ok: true,
      response: user,
    };
  } catch (error) {
    console.log("error ", error);
    return {
      ok: false,
      response: {
        code: "error-remove-account-user-db",
        msg: error,
      },
    };
  }
}
