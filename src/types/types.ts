export interface IPost {
  postID: string;
  userID: string;
  positive: Isentiment[];
  neutral: Isentiment[];
  negative: Isentiment[];
  totalToken: number;
  lastCommentID: string;
}

export interface Isentiment {
  id: string;
  timestamp: string;
}

export interface IDescription {
  type: string;
  children: [{ text: string }];
}

export interface IQuestionTest {
  question: string;
  options: string[];
  answer: string;
}
