"use client";

import "@styles/Login.scss";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (response.ok) {
        router.push("/");
      }

      if (response.error) {
        setError("Invalid email or password. Please try again!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="login">
      <img src="/assets/login.jpg" alt="login" className="login_decor" />

      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}
          <button type="submit">Log In</button>
        </form>

        <button className="google" onClick={loginWithGoogle}>
          <p>Log In with Google</p>
          <FcGoogle />
        </button>

        <Link href={"/"}>Don't have an account? Sign In Here</Link>
      </div>
    </div>
  );
};

export default Login;
