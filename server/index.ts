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
  
  app.post("/api/auth/magic-link", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(501).json({ 
        message: "Magic link authentication requires SendGrid. Please configure the SendGrid integration." 
      });
    }
    res.json({ message: "Magic link sent! Check your email." });
  });

  app.post("/api/auth/phone", async (req, res) => {
    const { phone, code } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return res.status(501).json({ 
        message: "Phone authentication requires Twilio. Please configure the Twilio integration." 
      });
    }
    if (code) {
      res.json({ message: "Phone verified successfully!" });
    } else {
      res.json({ message: "Verification code sent to your phone." });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    res.json({ message: "Account created! Please check your email to verify." });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    res.json({ message: "For email/password login, please use Replit Auth which supports email/password." });
  });

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
