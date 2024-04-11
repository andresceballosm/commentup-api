import { db } from "../config/firebase.config";
import { InstagramPost } from "../models/instagram-posts.model";

const axios = require("axios");

export const GetAccountsService = async (token: string) => {
  try {
    const accounts = await axios.get(
      `https://graph.facebook.com/me/accounts?access_token=${token}`,
    );
    console.log("accounts ", accounts);
    return {
      ok: true,
      response: {
        accounts: accounts.data,
      },
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-accounts",
        msg: error,
      },
    };
  }
};

export const GetInstagramIDService = async (
  token: string,
  accountID: number,
) => {
  try {
    const accounts = await axios.get(
      `https://graph.facebook.com/${accountID}?fields=instagram_business_account&access_token=${token}`,
    );
    return {
      ok: true,
      response: {
        id: accounts?.data.instagram_business_account?.id,
      },
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-instagram-id",
        msg: error,
      },
    };
  }
};

export const GetInstagramMediaService = async (
  token: string,
  instagramID: number,
  after?: string,
  limit?: number,
) => {
  try {
    const limitPag = limit ? limit : 20;
    const media = await axios.get(
      `https://graph.facebook.com/${instagramID}/media?fields=username,comments_count,like_count,thumbnail_url,timestamp,media_type,media_url,permalink&limit=${limitPag}&access_token=${token}&after=${after}`,
    );
    return {
      ok: true,
      response: media.data,
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-instagram-id",
        msg: error,
      },
    };
  }
};

export const GetInstagramStoriesService = async (
  token: string,
  instagramID: number,
  after?: string,
  limit?: number,
) => {
  try {
    const limitPag = limit ? limit : 20;
    const stories = await axios.get(
      `https://graph.facebook.com/${instagramID}/stories?fields=username,comments_count,like_count,thumbnail_url,timestamp,media_type,media_url,permalink&limit=${limitPag}&access_token=${token}&after=${after}`,
    );
    return {
      ok: true,
      response: stories.data,
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-instagram-id",
        msg: error,
      },
    };
  }
};

export const GetInstagramMediaByIDService = async (
  mediaID: string,
  token: string,
) => {
  try {
    const media = await axios.get(
      `https://graph.facebook.com/${mediaID}?fields=comments_count,media_url&access_token=${token}`,
    );
    return {
      ok: true,
      response: media.data,
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-instagram-id",
        msg: error,
      },
    };
  }
};

export const GetInstagramPostsByTypeService = async (
  token: string,
  postID: string,
  type: string,
) => {
  try {
    let posts;
    switch (type) {
      case "media":
        posts = await GetInstagramMediaByIDService(postID, token);
        break;
      case "stories":
        posts = await GetInstagramMediaByIDService(postID, token);
        break;
      default:
        break;
    }
    return posts;
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-instagram-id",
        msg: error,
      },
    };
  }
};

export const GetInstagramCommentsService = async (
  token: string,
  postID: any,
  after?: string,
  limit?: number,
) => {
  try {
    const limitPag = limit ? limit : 20;
    const comments = await axios.get(
      `https://graph.facebook.com/${postID}/comments?fields=from,timestamp,text,like_count&limit=${limitPag}&access_token=${token}&after=${after}`,
    );
    return {
      ok: true,
      response: {
        comments: comments.data,
      },
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-comments-by-post",
        msg: error,
      },
    };
  }
};

export const GetInstagramLikesByCommentService = async (
  token: string,
  commentId: string,
) => {
  try {
    const likes = await axios.get(
      `https://graph.facebook.com/${commentId}/likes?access_token=${token}`,
    );
    return {
      ok: true,
      response: {
        comments: likes.data,
      },
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-likes-by-comment",
        msg: error,
      },
    };
  }
};

export const GetInstagramCommentByIDService = async (
  token: string,
  commentID: any,
) => {
  try {
    const comments = await axios.get(
      `https://graph.facebook.com/${commentID}?fields=from,timestamp,text,like_count,replies&access_token=${token}`,
    );
    return {
      ok: true,
      response: {
        comments: comments.data,
      },
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-comments-by-post",
        msg: error,
      },
    };
  }
};

export const GetInstagramRepliesByComment = async (
  token: string,
  commentID: any,
) => {
  try {
    const replies = await axios.get(
      `https://graph.facebook.com/${commentID}/replies?fields=from,timestamp,text,like_count&access_token=${token}`,
    );
    return {
      ok: true,
      response: {
        replies: replies.data,
      },
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-replies-by-comment",
        msg: error,
      },
    };
  }
};

export const GetInstagramPostByID = async (token: string, commentID: any) => {
  try {
    const comments = await axios.get(
      `https://graph.facebook.com/${commentID}?fields=from,timestamp,text,like_count&access_token=${token}`,
    );
    return {
      ok: true,
      response: {
        comments: comments.data,
      },
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-comments-by-post",
        msg: error,
      },
    };
  }
};

export const GetPostByID = async (token: string, postID: any) => {
  try {
    const posts = await axios.get(
      `https://graph.facebook.com/${postID}?fields=username,comments_count,like_count,thumbnail_url,timestamp,media_type,media_url,permalink&access_token=${token}`,
    );
    return {
      ok: true,
      response: {
        post: posts.data,
      },
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-posts-by-id",
        msg: error,
      },
    };
  }
};

export const ReplyCommentService = async (
  token: string,
  commentID: string,
  message: string,
) => {
  try {
    const reply = await axios.post(
      `https://graph.facebook.com/${commentID}/replies?message=${message}&access_token=${token}`,
    );
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-create-reply-message",
        msg: error,
      },
    };
  }
};

export const GetUserDataService = async (token: string, userID: string) => {
  try {
    const user = await axios.get(
      `https://api.instagram.com/v1/users/search?q=${userID}&client_id=1664312407356140`,
    );
    return {
      ok: true,
      response: {
        user: user.data,
      },
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-get-user",
        msg: error,
      },
    };
  }
};

export const DeleteCommentService = async (
  commentID: string,
  token: string,
) => {
  try {
    const response = await axios.delete(
      `https://graph.facebook.com/v15.0/${commentID}?access_token=${token}`,
    );
    return {
      ok: true,
      response: {
        user: response.data,
      },
    };
  } catch (error) {
    return {
      ok: false,
      response: {
        code: "error-delete-comment",
        msg: error,
      },
    };
  }
};

export async function DeletePostsService(id: string) {
  try {
    const result = await InstagramPost.deleteMany({ userID: id });
    return {
      ok: true,
      response: result,
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
