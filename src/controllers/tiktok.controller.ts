import axios from "axios";
import { IAccount } from "../models/user.model";
import { GetAccountsService } from "../services/instagram.service";
import {
  AddAccountService,
  UpdateAccountService,
} from "../services/user.service";

export async function authenticationTiktok(req: any, res: any) {
  try {
    const csrfState = Math.random()
      .toString(36)
      .substring(2);
    res.cookie("csrfState", csrfState, { maxAge: 60000 });
    res.cookie("useID", req.user.id, { maxAge: 60000 });

    const domain =
      process.env.NODE_ENV === "production"
        ? "https://commentup-prod.herokuapp.com"
        : "https://commentup-dev.herokuapp.com";

    let url = "https://www.tiktok.com/auth/authorize/";

    url += `?client_key=${process.env.TIKTOK_CLIENT_KEY}`;
    url += "&scope=user.info.basic,video.list";
    url += "&response_type=code";
    url += `&redirect_uri=${domain}/api/v1/tiktok/oauth`;
    url += "&state=" + csrfState;

    res.json({
      ok: true,
      response: url,
    });
  } catch (error) {
    res.json({
      ok: false,
      //@ts-ignore
      response: error.message,
    });
  }

  //res.redirect(url);
}

export async function oAuthTiktok(req: any, res: any) {
  try {
    const { code, state } = req.query;
    const { csrfState, userID } = req.cookies;
    console.log("userID ", userID);

    if (state !== csrfState) {
      res.status(422).send("Invalid state");
      return;
    }

    let url_access_token = "https://open-api.tiktok.com/oauth/access_token/";
    url_access_token += "?client_key=" + process.env.CLIENT_KEY;
    url_access_token += "&client_secret=" + process.env.CLIENT_SECRET;
    url_access_token += "&code=" + code;
    url_access_token += "&grant_type=authorization_code";

    const responseOauth = await axios.post(url_access_token);

    const { open_id, access_token, refresh_token } = responseOauth.data;

    const tiktokAccount: IAccount = {
      name: "tiktok",
      id: open_id,
      token: access_token,
      refreshToken: refresh_token,
    };
    const existTiktokAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "tiktok",
    );
    const responseAddAccount = existTiktokAccount
      ? await UpdateAccountService(userID, tiktokAccount.token, "tiktok")
      : await AddAccountService(userID, tiktokAccount);
    res.redirect("commentup://");
  } catch (error) {
    res.json({
      ok: false,
      //@ts-ignore
      response: error.message,
    });
  }

  //res.redirect(url);
}

export async function addToken(req: any, res: any) {
  try {
    const { id, token, refreshToken } = req.body;
    console.log("id ", id, " TOKEN ", token);
    const user = req?.user;

    const tiktokAccount: IAccount = {
      name: "tiktok",
      id,
      token,
      refreshToken,
    };
    const existTiktokAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "tiktok",
    );
    const responseAddAccount = existTiktokAccount
      ? await UpdateAccountService(user._id, tiktokAccount.token, "tiktok")
      : await AddAccountService(user._id, tiktokAccount);

    res.json(responseAddAccount);
  } catch (error) {
    res.json({
      ok: false,
      //@ts-ignore
      response: error.message,
    });
  }
}
