import ServerApi from "@/utils/server-api";
import Form from "@components/form/form";
import { FormEvent, useState } from "react";

function Login() {
  const [nameOrEmail, setUsernameOrName] =
    useState<string>("user@example.com");
  const [password, setPassword] = useState<string>("string");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(nameOrEmail);
    console.log(password);
    await ServerApi.login(nameOrEmail, password);
    const result = await ServerApi.getProtected();
    console.log(result);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        value={nameOrEmail}
        onChange={(e) => setUsernameOrName(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" />
    </Form>
  );
}

export default Login;
