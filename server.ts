import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { google } from "googleapis";
import cookieSession from "cookie-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "heraxis-default-secret"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    sameSite: "none",
  })
);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.APP_URL || "http://localhost:3000"}/api/auth/google/callback`
);

// Auth Routes
app.get("/api/auth/google/url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    prompt: "consent",
  });
  res.json({ url });
});

app.get("/api/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    req.session!.tokens = tokens;
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/api/auth/status", (req, res) => {
  res.json({ connected: !!req.session?.tokens });
});

app.post("/api/auth/logout", (req, res) => {
  req.session = null;
  res.json({ success: true });
});

// Calendar Routes
app.post("/api/calendar/sync", async (req, res) => {
  if (!req.session?.tokens) {
    return res.status(401).json({ error: "Not authenticated with Google" });
  }

  const { appointment } = req.body;
  if (!appointment) {
    return res.status(400).json({ error: "Appointment data required" });
  }

  oauth2Client.setCredentials(req.session.tokens);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const startDateTime = new Date(`${appointment.date}T${appointment.time}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

  const event = {
    summary: `HERAXIS: ${appointment.title}`,
    description: appointment.notes || "",
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "UTC",
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 30 },
        { method: "email", minutes: 24 * 60 },
      ],
    },
  };

  try {
    let result;
    if (appointment.googleEventId) {
      result = await calendar.events.update({
        calendarId: "primary",
        eventId: appointment.googleEventId,
        requestBody: event,
      });
    } else {
      result = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });
    }
    res.json({ eventId: result.data.id });
  } catch (error) {
    console.error("Error syncing with Google Calendar:", error);
    res.status(500).json({ error: "Failed to sync with Google Calendar" });
  }
});

app.delete("/api/calendar/sync/:eventId", async (req, res) => {
  if (!req.session?.tokens) {
    return res.status(401).json({ error: "Not authenticated with Google" });
  }

  const { eventId } = req.params;
  oauth2Client.setCredentials(req.session.tokens);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting Google Calendar event:", error);
    res.status(500).json({ error: "Failed to delete from Google Calendar" });
  }
});

async function startServer() {
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
