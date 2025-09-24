import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://portolio-react-redux-ui.vercel.app",
    "https://portolio-react-redux-80650y0g6-manuel-prez-s-projects.vercel.app",
    "https://portfolio-server-hddu.onrender.com",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Ruta del formulario
app.post("/contact", async (req, res) => {
  const { firstName, lastName, email, date, comments } = req.body;

  if (!firstName || !lastName || !email || !comments) {
    return res.status(400).json({ success: false, msg: "Missing fields" });
  }

  try {
    await axios.post(
      "https://api.resend.com/emails",
      {
        from: `Portfolio <onboarding@resend.dev>`,
        to: [process.env.EMAIL_TO],             
        subject: `New message from: ${firstName} ${lastName}`,
        text: `From: ${email}\nDate: ${date}\nComments: ${comments}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, msg: "Successfully sent message ✅" });
  } catch (err) {
    console.error("Resend error:", err.response?.data || err.message);
    res.status(500).json({ success: false, msg: "There was an error ❌" });
  }
});

// Puerto dinámico
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));


export default app;