import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { usePlaidLink } from "react-plaid-link";

axios.defaults.baseURL = "http://localhost:8000";

function App() {
  const [linkToken, setLinkToken] = useState();
  useEffect(() => {
    async function fetch() {
      const response = await axios.post("/create_link_token");
      setLinkToken(response.data.link_token);
    }
    fetch();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      console.log("success", public_token, metadata);
      // send public_token to server
    },
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
}

export default App;
