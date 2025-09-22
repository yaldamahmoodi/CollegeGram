import { Router } from "express";
import EmailService from "../services/email.service.js";

const router = Router();

router.get("/", async (req, res) => {
  const emailResults = await EmailService.sendHealthCheckEmails();
  res.status(200).json({});
  res.status(200).json({
    status: "ok",
    message: "Server is running & Email system is working correctly",
    version: "1.0.0",
    server: "CollegeGram",
    emailCheck: {
      success: true,
      message: "All test emails sent successfully",
      results: emailResults.results,
    },
  });
});

export default router;
