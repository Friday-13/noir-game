import { ICredentials, login } from "@/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { saveNameOrEmail } from "@/utils/manage-nickname";
import ServerApi from "@/utils/server-api";
import Form from "@components/form/form";
import { FormEvent, useState } from "react";
import {  useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState<string>("username");
  const [email, setEmail] = useState<string>("user@example.com");
  const [password, setPassword] = useState<string>("string");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(name);
    console.log(password);
    const response = await ServerApi.register(name, email, password);
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
    const credentials: ICredentials = await response.json();
    dispatch(login(credentials));
    navigate("/");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" />
      {errorMessage && <span>{errorMessage}</span>}
    </Form>
  );
}

export default Register;
