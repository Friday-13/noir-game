import { register } from "@/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Form from "@components/form/form";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState<string>("username");
  const [email, setEmail] = useState<string>("user@example.com");
  const [password, setPassword] = useState<string>("string");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(register({ name, email, password }));
  };

  useEffect(() => {
    if (authState.isAuth) {
      navigate("/");
    } else {
      setErrorMessage(authState.error);
    }
  }, [authState.isAuth, authState.error, navigate]);

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="text"
        value={name}
        placeholder="name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        value={email}
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" />
      {errorMessage && <span>{errorMessage}</span>}
    </Form>
  );
}

export default Register;
