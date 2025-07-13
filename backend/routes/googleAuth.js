// routes/googleAuth.js
const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    res.status(200).json({ success: true, user: { email, name, picture } });
  } catch (err) {
    res.status(401).json({ success: false, message: "Token verification failed" });
  }
});

module.exports = router;
