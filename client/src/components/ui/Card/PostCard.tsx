import React, { useState } from "react";
import { Post } from "../../../types/post";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../../store";
// import { setPostActions } from "../../../slices/postSlice";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import "./Card.css";

type CardProps = {
  post: Post;
};

const PostCard: React.FC<CardProps> = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [text, setText] = useState("");

  const { user } = useAuth();
  // const dispatch = useDispatch<AppDispatch>();
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();

  const handleLike = async (postId: string) => {
    try {
      setLikes([...likes, user?._id ?? ""]);
      await axiosPrivate.put(
        "/post/like",
        { postId },
        {
          signal: controller.signal,
        },
      );

      // await dispatch(setPostActions(response.data.post));
    } catch (error) {
      console.log(error);
      setLikes(likes.filter((id) => id !== user?._id));
    }
  };

  const handleUnlike = async (postId: string) => {
    try {
      setLikes(likes.filter((id) => id !== user?._id));
      await axiosPrivate.put(
        "/post/unlike",
        { postId },
        {
          signal: controller.signal,
        },
      );

      // await dispatch(setPostActions(response.data.post));
    } catch (error) {
      console.log(error);
      setLikes([...likes, user?._id ?? ""]);
    }
  };

  const handleComment = async (postId: string, text: string) => {
    try {
      const response = await axiosPrivate.put(
        "/post/comment",
        { postId, text },
        {
          signal: controller.signal,
        },
      );

      // await dispatch(setPostActions(response.data.post));
      setComments(response.data.post.comments || []);
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div key={post._id} className="card">
      <h2>@{post.postedBy.name}</h2>
      <div className="post-title">
        <span>{post.title}</span>
      </div>
      <div className="photo-container">
        <img alt="photo" src={post.photo || "./logo512.png"} />
      </div>
      <div className="action-container">
        {likes.includes(user?._id ?? "") ? (
          <img
            alt="save"
            src="./heart-fill.svg"
            onClick={() => {
              handleUnlike(post._id);
            }}
          />
        ) : (
          <img
            alt="save"
            src="./heart.svg"
            onClick={() => {
              handleLike(post._id);
            }}
          />
        )}
      </div>
      <div className="likes-count">
        {likes && likes.length > 0 ? <span>{likes.length} likes</span> : <span>0 like</span>}
      </div>
      <p>{post.body}</p>
      <div className="comments">
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment-details">
              <img alt="like" src="./avatar-boy.svg" />
              <div className="user-wrapper">
                <span className="comment-owner">{comment.commentedBy.name}</span>
                <span className="comment">{comment.text}</span>
              </div>
            </div>
          ))
        ) : (
          <div></div>
        )}
        <div className="input-wrapper">
          <input
            className="comment-input"
            type="text"
            placeholder="add a comment..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />

          <img
            alt="like"
            src="./send.svg"
            onClick={() => {
              handleComment(post._id, text);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
