import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json({ limit: "6mb" }));
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // log the requests
app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

// apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ success: false, message: "Too many requests." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ success: false, message: "Bot access denied." });
      } else {
        return res.status(403).json({ success: false, message: "Forbidden." });
      }
    }

    // check for spoofed bots
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      return res.status(403).json({ success: false, message: "Spoofed bot detected." });
    }

    return next();
  } catch (error) {
    return next(error);
  }
});

app.use("/api/products", productRoutes);
if (process.env.NODE_ENV === "production") {
  // serve our react app
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`ALTER TABLE products ALTER COLUMN image TYPE TEXT`;
  } catch (error) {
    throw new Error("Database initialization failed.", { cause: error });
  }
}

app.use((error, _req, res, next) => {
  if (res.headersSent) return next(error);

  console.error("Unhandled request error:", error);
  const status = error.status === 413 ? 413 : error.status === 400 ? 400 : 500;
  return res.status(status).json({
    success: false,
    message: status === 413 ? "Request body is too large." : "Internal server error.",
  });
});

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });