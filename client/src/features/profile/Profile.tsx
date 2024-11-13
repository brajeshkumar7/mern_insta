import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootTypes } from "../../types";
import { AppDispatch } from "../../store";
import { setPostData } from "../../slices/postSlice";
import { IconButton } from "../../components/ui/Button/Button";
import { FaTrash } from "react-icons/fa";
import { Popup } from "../../components/ui/Popup";
import useAuth from "../../hooks/useAuth";
import Layout from "../../components/Layout/Layout";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./Profile.css";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { post } = useSelector((state: RootTypes) => state.post);
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const controller = new AbortController();

    const fetchPost = async () => {
      try {
        const response = await axiosPrivate("/post/my", {
          signal: controller.signal,
        });

        if (isMounted) {
          dispatch(setPostData(response.data));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [dispatch]);

  const showPopup = (postId: string) => {
    setIsPopupVisible(true);
    // console.log(postId);
    // setSelectedPostId("66b07af5f29b96d8d2eefe3b");
    setSelectedPostId(postId);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedPostId(null);
  };

  const controller = new AbortController();

  const handleDelete = async () => {
    setLoading(true);

    if (selectedPostId) {
      try {
        await axiosPrivate.delete(`/post/${selectedPostId}`, {
          signal: controller.signal,
        });

        closePopup();
        alert("success");

        const postData = {
          post: post && post.filter((p) => p._id !== selectedPostId),
        };

        if (post) {
          await dispatch(setPostData(postData));
        }
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post. Please try again.");
      } finally {
        setLoading(false);
        closePopup();
      }
    }
  };

  useEffect(() => {
    return () => controller.abort();
  }, []);

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-wrapper">
          <img alt="avatar" src="./avatar.svg" />
          <div className="profile-user-details">
            <span className="profile-user-name">{user?.name}</span>
            <div className="followers">
              <p>Post 86</p>
              <p>Followers 100</p>
              <p>Followings 100</p>
            </div>
          </div>
        </div>
        <div className="post-wrapper">
          {loading ? (
            <p>Loadng...</p>
          ) : post && post.length > 0 ? (
            post.map((post) => (
              <div key={post._id} className="post-item">
                <div className="post-action">
                  <img alt="post" src={post.photo} />
                  <div className="delete-icon-btn">
                    <IconButton
                      disabled={false}
                      icon={<FaTrash />}
                      onClick={() => showPopup(post._id)}
                      children={undefined}
                    />
                  </div>
                </div>
                <span className="post-title">{post?.title}</span>
              </div>
            ))
          ) : (
            <p>No post available...</p>
          )}
        </div>
      </div>
      {isPopupVisible && (
        <Popup
          message="Are you sure?"
          onClose={closePopup}
          onClick={handleDelete}
          disabled={loading}
        />
      )}
    </Layout>
  );
};

export default Profile;
