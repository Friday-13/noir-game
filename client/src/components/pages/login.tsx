import { login } from "@/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { saveNameOrEmail } from "@/utils/manage-nickname";
import ServerApi from "@/utils/server-api";
import Form from "@components/form/form";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [nameOrEmail, setNameOrEmail] = useState<string>("user@example.com");
  const [password, setPassword] = useState<string>("string");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await ServerApi.login(nameOrEmail, password);
    if (!response.ok) {
      const content = await response.json();
      const message = content?.detail?.message;
      if (message) {
        setErrorMessage(message);
      } else {
        throw new Error(JSON.stringify(content));
      }
      return;
    }
    dispatch(
      login({ nameOrEmail: nameOrEmail, token: ServerApi.getCsrfToken() })
    );
    saveNameOrEmail(nameOrEmail);
    navigate("/");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        value={nameOrEmail}
        onChange={(e) => setNameOrEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" />
      <span>{errorMessage}</span>
    </Form>
  );
}

export default Login;
