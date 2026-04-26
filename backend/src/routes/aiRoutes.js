const express = require("express");

const AssistantSession = require("../models/AssistantSession");
const RecognitionJob = require("../models/RecognitionJob");
const { requireAuth } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();
const assistantRouter = express.Router();

router.use(requireAuth);
assistantRouter.use(requireAuth);

router.post(
  "/recognition/prepare",
  asyncHandler(async (req, res) => {
    const job = await RecognitionJob.create({
      user: req.user._id,
      imageUrl: req.body.imageUrl,
      status: "queued"
    });

    res.status(202).json({
      job,
      message: "Recognition job queued. Connect a vision model worker to process this job."
    });
  })
);

assistantRouter.post(
  "/messages",
  asyncHandler(async (req, res) => {
    const content = String(req.body.content || "").trim();
    if (!content) {
      const error = new Error("Message content is required");
      error.status = 400;
      throw error;
    }

    const session =
      (await AssistantSession.findOne({ user: req.user._id }).sort({ updatedAt: -1 })) ||
      new AssistantSession({ user: req.user._id, messages: [] });

    session.messages.push({ role: "user", content });
    session.messages.push({
      role: "assistant",
      content:
        "I can help with Indian hostel diet planning. AI model integration is ready; connect your LLM provider in this route.",
      metadata: { placeholder: true }
    });
    await session.save();

    res.json({ session });
  })
);

module.exports = router;
module.exports.assistantRouter = assistantRouter;

