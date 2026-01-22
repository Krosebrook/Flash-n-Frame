import express from "express";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.NODE_ENV === "production" ? 5000 : 3001;

app.use(express.json());

async function startServer() {
  await setupAuth(app);
  registerAuthRoutes(app);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Auth server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
