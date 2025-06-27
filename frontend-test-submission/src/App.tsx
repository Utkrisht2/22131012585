import React, { useEffect } from "react";
import { log } from "../../logging-middleware/log";

function App() {
  useEffect(() => {
    log({
      stack: "frontend",
      level: "info",
      package: "component",
      message: "App component mounted"
    });
  }, []);

  return (
    <div>
      <h1>Frontend Test Submission</h1>
      {/* Your app code */}
    </div>
  );
}

export default App;