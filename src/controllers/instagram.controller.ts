import e, { Response } from "express";
import { TITLE_ERROR } from "../constants/messages.constants";
import { Bill } from "../models/bill.model";
import { InstagramPost } from "../models/instagram-posts.model";
import { ITransaction } from "../models/transaction.model";
import { IAccount, User } from "../models/user.model";
import { CommentClassificationService } from "../services/comments.service";
import {
  DeleteCommentService,
  GetAccountsService,
  GetInstagramCommentByIDService,
  GetInstagramCommentsService,
  GetInstagramIDService,
  GetInstagramLikesByCommentService,
  GetInstagramMediaService,
  GetInstagramPostsByTypeService,
  GetInstagramRepliesByComment,
  GetInstagramStoriesService,
  GetUserDataService,
  ReplyCommentService,
} from "../services/instagram.service";
import { CreateTransactionService } from "../services/transaction.service";
import {
  AddAccountService,
  UpdateAccountService,
} from "../services/user.service";
import { IPost, Isentiment } from "../types/types";
const axios = require("axios");

export async function connectInstagramAccount(req: any, res: Response) {
  try {
    const token = req?.params.token;
    //Get accounts
    const accountsResponse = await GetAccountsService(token);
    if (!accountsResponse.ok) {
      return res.send(accountsResponse);
    }
  
    if (accountsResponse.response.accounts.data.length === 0) {
      return res.send({
        ok: false,
        response: {
          code: "add-page-fb-connect-instagram",
          msg:
            "Sorry, you need to create a page in facebook and connect this page with instagram.",
        },
      });
    }

    // Get instagram id
    for (const account of accountsResponse.response.accounts.data) {
      const accountID = account.id;
      const instagramIdResponse = await GetInstagramIDService(token, accountID);
      if (instagramIdResponse.ok && instagramIdResponse.response.id) {
        const instagramAccount: IAccount = {
          name: "instagram",
          token,
          id: instagramIdResponse.response.id,
        };
        const existInstagramAccount = req.user.accounts.find(
          (account: IAccount) => account.name === "instagram",
        );

        const responseAddAccount = existInstagramAccount
          ? await UpdateAccountService(
              req.user._id,
              instagramAccount.token,
              "instagram",
            )
          : await AddAccountService(req.user._id, instagramAccount);

        if (!responseAddAccount.ok) {
          continue;
        }

        const responseMedia = await GetInstagramMediaService(
          token,
          instagramIdResponse.response.id,
          "",
        );

        let media = [];

        if (responseMedia.ok) {
          media = responseMedia.response;
        }

        return res.status(200).send({
          ok: true,
          message: "Instagram account connected successfully.",
          response: {
            media: media,
            user: responseAddAccount.response,
          },
        });
      }
    }

    return res.send({
      ok: false,
      response: {
        code: "add-page-fb-connect-instagram",
        msg:
          "Sorry, you need to create a page in facebook and connect this page with instagram.",
      },
    });
    // if (!instagramIdResponse.ok) {
    //   return res.send(instagramIdResponse);
    // }

    // const instagramAccount: IAccount = {
    //   name: "instagram",
    //   token,
    //   id: instagramIdResponse.response.id,
    // };

    // const responseAddAccount = await AddAccountService(
    //   req.id,
    //   instagramAccount,
    // );

    // if (!responseAddAccount.ok) {
    //   return res.send(responseAddAccount);
    // }

    // const responseMedia = await GetInstagramMediaService(
    //   token,
    //   instagramIdResponse.response.id,
    // );
  } catch (error) {
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

export async function getAccounts(req: any, res: Response) {
  try {
    //const user = req?.user;
    const token = "";
    const accountsResponse = await GetAccountsService(token);
    return res.status(200).send({
      ok: true,
      message: null,
      response: {
        accounts: accountsResponse.response,
      },
    });
  } catch (error) {
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

export async function getMedia(req: any, res: Response) {
  try {
    const { after } = req.body;
    const instagramAccount: IAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "instagram",
    );

    if (!instagramAccount) {
      return res.status(400).send({
        error: false,
        response: "Instagram account connected is required",
      });
    }

    const responseMedia = await GetInstagramMediaService(
      instagramAccount.token,
      instagramAccount.id,
      after,
    );
    let media = [];

    if (responseMedia.ok) {
      media = responseMedia.response;
    } else {
      res.send(responseMedia);
    }

    return res.send({
      ok: true,
      message: null,
      response: {
        media,
      },
    });
  } catch (error) {
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

export async function getStories(req: any, res: Response) {
  try {
    const { after } = req.body;
    const instagramAccount: IAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "instagram",
    );

    if (!instagramAccount) {
      return res.status(400).send({
        error: false,
        response: "Instagram account connected is required",
      });
    }

    const responseMedia = await GetInstagramStoriesService(
      instagramAccount.token,
      instagramAccount.id,
      after,
    );

    let stories = [];

    if (responseMedia.ok) {
      stories = responseMedia.response;
    }

    return res.send({
      ok: true,
      message: null,
      response: {
        stories,
      },
    });
  } catch (error) {
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

export async function getComments(req: any, res: Response) {
  try {
    const { id } = req.params;
    const instagramAccount: IAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "instagram",
    );

    if (!instagramAccount) {
      return res.status(400).send({
        error: false,
        response: "Instagram account connected is required",
      });
    }

    const responseComments = await GetInstagramCommentsService(
      instagramAccount.token,
      id,
    );

    if (!responseComments) {
      return res.send(responseComments);
    }

    const comments = responseComments.response.comments;

    return res.send({
      ok: true,
      message: null,
      response: {
        comments,
      },
    });
  } catch (error) {
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

export async function getRepliesByCommentId(req: any, res: Response) {
  try {
    const { id } = req.params;
    const instagramAccount: IAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "instagram",
    );

    if (!instagramAccount) {
      return res.status(400).send({
        error: false,
        response: "Instagram account connected is required",
      });
    }

    const repliesResponse = await GetInstagramRepliesByComment(
      instagramAccount.token,
      id,
    );
    if (repliesResponse.ok) {
      const replies = repliesResponse?.response.replies.data;
      return res.send({
        ok: true,
        response: replies,
      });
    }
  } catch (error) {
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

export async function getCommentsById(req: any, res: Response) {
  try {
    const { comments, postID, type } = req.body;
    const instagramAccount: IAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "instagram",
    );

    if (!instagramAccount) {
      return res.status(400).send({
        error: false,
        response: "Instagram account connected is required",
      });
    }

    const data = [];
    let needUpdatePost = false;
    const post = await InstagramPost.findOne({ postID: postID });

    for (const comment of comments) {
      const responseComments = await GetInstagramCommentByIDService(
        instagramAccount.token,
        comment.id,
      );

      if (!responseComments.ok) {
        switch (type) {
          case "commentsPostive":
            post.positive = post.positive.filter(
              (item: Isentiment) => item.id !== comment.id,
            );
            break;
          case "commentsNeutral":
            post.neutral = post.neutral.filter(
              (item: Isentiment) => item.id !== comment.id,
            );
            break;
          case "commentsNegative":
            post.negative = post.negative.filter(
              (item: Isentiment) => item.id !== comment.id,
            );
            break;
          default:
            break;
        }
        await InstagramPost.findByIdAndUpdate(post.id, post, {
          upsert: true,
        });
        needUpdatePost = true;
      }
      if (!responseComments) {
        return res.send(responseComments);
      }

      let commentData = responseComments.response.comments;
      data.push(commentData);
    }

    return res.send({
      ok: true,
      message: null,
      response: {
        comments: data,
        needUpdatePost,
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

export async function getPostAnalyzed(req: any, res: Response) {
  try {
    const { id } = req.params;
    const instagramPosts = await InstagramPost.findOne({ postID: id });
    if (!instagramPosts) {
      return res.send({
        ok: true,
        response: {
          post: null,
        },
      });
    }
    if (req.id !== instagramPosts.userID) {
      return res.status(400).send({
        error: false,
        response: "User don't have permissions to read this post",
      });
    }

    return res.send({
      ok: true,
      response: {
        post: instagramPosts,
      },
    });
  } catch (error) {
    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function analyzeComments(req: any, res: Response) {
  try {
    const limit = 10;
    const { id, type } = req.body;
    const instagramAccount: IAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "instagram",
    );

    if (!instagramAccount) {
      return res.status(400).send({
        error: false,
        response: "Instagram account connected is required",
      });
    }

    if (new Date() > new Date(req.user.trialPeriod)) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          pricing: 0.00008,
        },
        {
          upsert: true,
        },
      );
    }

    const billOverdue = await Bill.findOne({
      userID: req.user.id,
      status: "overdue",
    });

    if (billOverdue) {
      return res.send({
        error: false,
        response: {
          code: "billOverdueUnAuthorizedAnalyze",
        },
      });
    }
    const instagramPosts = await InstagramPost.findOne({ postID: id });
    const postData = await GetInstagramPostsByTypeService(
      instagramAccount.token,
      id,
      type,
    );

    if (!postData?.ok) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: "Failed getting comments count",
          code: "errorAnalyzeComments",
        },
      });
    }
    const commentsCount = postData?.response?.comments_count;

    const times = Math.ceil(commentsCount / limit);
    const queries = Array.from(Array(times).keys());
    const comments: any[] = [];
    let paging;
    let after;

    for (const file of queries) {
      const withAfter: string = file > 0 ? after : "";
      const responseComments = await GetInstagramCommentsService(
        instagramAccount.token,
        id,
        withAfter,
        limit,
      );
      if (!responseComments) {
        return res.send(responseComments);
      }
      const commentsData = responseComments.response?.comments;
      if (commentsData) {
        for (const comment of commentsData?.data) {
          comments.push(comment);
        }
        paging = commentsData?.paging;
        after = paging?.cursors?.after;
      }
    }

    let post: IPost;
    if (instagramPosts) {
      post = instagramPosts;
    } else {
      post = {
        postID: id,
        positive: [],
        neutral: [],
        negative: [],
        userID: req.id,
        totalToken: 0,
        lastCommentID: "",
      };
    }

    let counter = 0;
    let tokensUsed = 0;
    for (const comment of comments) {
      if (comment.id === post.lastCommentID) {
        break;
      }
      const analyze = await CommentClassificationService(comment.text);
      if (analyze.status !== 200) {
        return res.send({
          ok: false,
          response: {
            msg: "Error",
            code: "errorAnalyzeComments",
          },
        });
      }
      counter += 1;
      const sentiment = analyze.data.choices[0].text;
      post.totalToken += analyze.data.usage.total_tokens;
      tokensUsed += analyze.data.usage.total_tokens;
      const item = {
        id: comment?.id,
        timestamp: comment?.timestamp,
      };
      if (sentiment === " Positive") {
        post.positive.push(item);
      } else if (sentiment === " Neutral") {
        post.neutral.push(item);
      } else {
        post.negative.push(item);
      }
    }
    post.lastCommentID = comments[0].id;

    post.positive.sort(
      (a, b) =>
        new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf(),
    );
    post.neutral.sort(
      (a, b) =>
        new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf(),
    );
    post.negative.sort(
      (a, b) =>
        new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf(),
    );

    let response;
    if (instagramPosts) {
      response = await InstagramPost.findByIdAndUpdate(
        instagramPosts.id,
        post,
        {
          upsert: true,
        },
      );
    } else {
      const postRequest = new InstagramPost(post);
      response = await postRequest.save();
    }
    //Create transaction
    if (counter > 0) {
      const imagePost = postData?.response?.media_url || "";
      const data: ITransaction = {
        postID: post.postID,
        social: "instagram",
        tokens: tokensUsed,
        pricing: req.user.pricing * tokensUsed,
        comments: counter,
        userID: req.user.id,
        imagePost,
      };
      await CreateTransactionService(data);
    }

    return res.send({
      ok: true,
      response: {
        msg: `We analyzed ${counter} comments!`,
        post: post,
      },
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(400).send({
      ok: false,
      response: {
        msg: error,
        code: null,
      },
    });
  }
}

export async function replyComment(req: any, res: Response) {
  try {
    const { commentID, message } = req.body;

    const instagramAccount: IAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "instagram",
    );

    if (!instagramAccount) {
      return res.status(400).send({
        error: false,
        response: "Instagram account connected is required",
      });
    }

    const replyReq = await ReplyCommentService(
      instagramAccount.token,
      commentID,
      message,
    );

    if (!replyReq.ok) {
      return res.send(replyReq);
    }

    const repliesResponse = await GetInstagramRepliesByComment(
      instagramAccount.token,
      commentID,
    );
    return res.send(repliesResponse);
  } catch (error) {
    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function getUserData(req: any, res: Response) {
  try {
    const { id } = req.params;
    const instagramAccount: IAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "instagram",
    );
    const user = await GetUserDataService(instagramAccount.token, id);
    return res.send(user);
  } catch (error) {
    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function removeComment(req: any, res: Response) {
  try {
    const { id } = req.params;
    const instagramAccount: IAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "instagram",
    );
    const response = await DeleteCommentService(id, instagramAccount.token);
    return res.send(response);
  } catch (error) {
    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function getCommentsAleatory(req: any, res: Response) {
  try {
    const { comments } = req.body;
    const instagramAccount: IAccount = req.user.accounts.find(
      (account: IAccount) => account.name === "instagram",
    );

    if (!instagramAccount) {
      return res.status(400).send({
        error: false,
        response: "Instagram account connected is required",
      });
    }

    const data = [];

    for (const comment of comments) {
      const responseComments = await GetInstagramCommentByIDService(
        instagramAccount.token,
        comment.id,
      );
      let commentData = responseComments.response.comments;
      data.push(commentData);
    }

    return res.send({
      ok: true,
      response: {
        comments: data,
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
