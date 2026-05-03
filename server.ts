import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock Election Data API
  app.get("/api/election-timeline", (req, res) => {
    const { city, state } = req.query;
    // In a real app, this would fetch from a DB or external API
    res.json({
      location: { city, state },
      events: [
        { date: "2026-06-01", title: "Registration Deadline", description: "Last day to register for the upcoming primary." },
        { date: "2026-07-15", title: "Primary Election", description: "Voters decide which candidates will represent their party." },
        { date: "2026-10-20", title: "Early Voting Starts", description: "Skip the lines and vote early at designated centers." },
        { date: "2026-11-03", title: "Election Day", description: "General elections for local and state offices." },
      ]
    });
  });

  app.get("/api/candidates", (req, res) => {
    res.json([
      { id: "1", name: "Sarah Jenkins", party: "Democratic", role: "Mayor", platform: "Green energy & education", bio: "Former city council member with a focus on neighborhood revitalization." },
      { id: "2", name: "David Thorne", party: "Republican", role: "Mayor", platform: "Business growth & low taxes", bio: "Lifelong entrepreneur dedicated to making the city a hub for innovation." },
      { id: "3", name: "Elena Rodriguez", party: "Independent", role: "Mayor", platform: "Transparency & infrastructure", bio: "Civil engineer with 20 years of experience in public works." },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
