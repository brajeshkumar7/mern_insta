import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Input } from "../../components/ui/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post } from "../../types/post";
import { Schema } from "./PostSchema";
import z from "zod";
import axios from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./PostForm.css";

type FormFields = z.infer<typeof Schema>;
type postFormProps = {
  post?: Post;
};

const PostForm = ({ post }: postFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: post
      ? {
          title: post.title,
          description: post.body,
          file: post.photo,
        }
      : undefined,
    resolver: zodResolver(Schema),
  });
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const axiosPrivate = useAxiosPrivate();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { title, description, file } = data;

    try {
      const data = new FormData();
      data.append("file", file[0]);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "dgbgvecx3");

      const imgURI = await axios.post(
        "https://api.cloudinary.com/v1_1/dgbgvecx3/image/upload",
        data
      );

      if (imgURI.data.url) {
        await axiosPrivate.post("/post", {
          title,
          body: description,
          image_url: imgURI.data.url,
        });

        reset();
        setImage(null);
        alert("success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="post-form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Title"
            name="title"
            type="text"
            register={register}
            error={errors.title?.message}
          />
          <Input
            label="Description"
            name="description"
            type="text"
            register={register}
            error={errors.description?.message}
          />
          <Input
            label="Image"
            name="file"
            type="file"
            register={register}
            error={errors.file?.message?.toString()}
            onChange={handleFileChange}
          />
          <div className="image-container">
            {image && <img src={image as string} alt="Selected" />}
          </div>
          <Button disabled={isSubmitting}>{isSubmitting ? "Posting..." : "Post"}</Button>
          <div className="root-error-container">
            {errors.root?.message && <span className="input-error">{errors.root?.message}</span>}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default PostForm;
