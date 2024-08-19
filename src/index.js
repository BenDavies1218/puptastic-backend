import app from "./server.js";
import {
  databaseConnect,
  databaseClear,
  databaseClose,
} from "./utils/database.js";

async function startServer() {
  // https://www.youtube.com/watch?v=eQAIojcArRY&t=520s
  try {
    console.log("Connecting to the database...");
    await databaseConnect();

    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start the server:", error);
  }
}

startServer();
