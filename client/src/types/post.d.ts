export interface Post {
  _id: string;
  title: string;
  body: string;
  photo?: string;
  postedBy: {
    id: string;
    name: string;
  };
  likes?: string[];
  comments?: {
    commentedBy: {
      _id: string;
      name: string;
    };
    _id: string;
    text: string;
  }[];
}

export interface PostState {
  post?: Post[];
}
