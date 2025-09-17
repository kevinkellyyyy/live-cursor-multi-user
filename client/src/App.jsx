import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Home from "./Home";

function App() {
  const [username, setUsername] = useState(null);

  return username ? (
    <Home username={username} />
  ) : (
    <Login onSubmit={setUsername} />
  );
}

export default App;
