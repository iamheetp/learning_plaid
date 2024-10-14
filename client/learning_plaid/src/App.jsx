import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [backendData, setBackendData] = useState([{}]);
  useEffect(() => {
    fetch("/api")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setBackendData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setBackendData({ error: "Failed to fetch data" });
      });
  }, []);

  return (
    <>
      <div>
        {typeof backendData.users === "undefined" ? (
          <p>Loading</p>
        ) : (
          backendData.users.map((user, i) => <p key={i}>{user}</p>)
        )}
      </div>
    </>
  );
}

export default App;
