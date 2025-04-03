import { useOnlyUnauthorized } from "@/hooks/access-control";
import { login } from "@/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Form from "@components/form/form";
import { FormEvent, useEffect, useState } from "react";

function Login() {
  useOnlyUnauthorized();
  const [nameOrEmail, setNameOrEmail] = useState<string>("user@example.com");
  const [password, setPassword] = useState<string>("string");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(login({ nameOrEmail, password }));
  };

  useEffect(() => {
    setErrorMessage(authState.error);
  }, [authState.error]);

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="name or email"
        value={nameOrEmail}
        onChange={(e) => setNameOrEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" />
      <span>{errorMessage}</span>
    </Form>
  );
}

export default Login;
