import React from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./loginSchema";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import "./Login.css";

type FormFields = z.infer<typeof schema>;

interface ErrorResponse {
  error: string;
}

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.form?.pathname || "/";

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { email, password } = data;

    try {
      const controller = new AbortController();
      const response = await axios.post(
        "/signin",
        { email, password },
        { signal: controller.signal }
      );
      const result = response.data;
      setAuth({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: {
          _id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          roles: result.user.roles,
        },
      });
      navigate(from, { replace: true });
    } catch (error) {
      if (isAxiosError(error)) {
        const serverError = error.response?.data as ErrorResponse;
        const errorMessage = serverError?.error || "An unexpected error occurred";
        setError("root", {
          type: "manual",
          message: errorMessage,
        });
      } else if (error instanceof Error) {
        setError("root", {
          type: "manual",
          message: error.message || "An unexpected error occurred",
        });
      }
    }
  };

  return (
    <div className="hm-login">
      <div className="container">
        <div className="row">
          <div className="col-left">
            <div className="hm-col-wrap">
              <div className="hmlogo"></div>
              <div className="login-title">
                <h1>Members Login</h1>
              </div>
            </div>
          </div>
          <div className="col-right">
            <div className="login-form-wrap">
              <h2>Login</h2>
              <div className="l-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    label="Email"
                    name="email"
                    type="text"
                    register={register}
                    error={errors.email?.message}
                  />
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    register={register}
                    error={errors.password?.message}
                  />
                  <Button disabled={isSubmitting}>{isSubmitting ? "Log in..." : "Log in"}</Button>
                  <div className="root-error-container">
                    {errors.root?.message && (
                      <span className="input-error">{errors.root?.message}</span>
                    )}
                  </div>
                </form>
                <hr className="seperator" />
                <div className="no-account">
                  <p>
                    Don&apos;t have an account ? Get your <a href="/register">Free account Now</a>
                  </p>
                </div>
                <div className="no-account">
                  <a href="#">Forgotten password?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
