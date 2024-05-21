import { useState } from "react";
import Body from "./Components/HomePage";

function App() {
  const [joined, setJoined] = useState(false);

  return (
    <div>
      {!joined && (
        <div style={{ textAlign: "center",  display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" }}>
          <img style={{ width: "200px", height: "200px", margin: "20px" }} src="/src/assets/omegle-logo.png" alt="omegle-logo" />
          <button
            style={{ padding: "10px", backgroundColor: "#1a73e8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
            onClick={() => setJoined(true)}
          >
            Join Me
          </button>
        </div>
      )}

      {joined && <Body />}
    </div>
  );
}

export default App;
