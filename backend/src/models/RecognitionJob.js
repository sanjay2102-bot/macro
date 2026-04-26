const mongoose = require("mongoose");

const recognitionJobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: String,
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued"
    },
    predictions: [
      {
        foodName: String,
        confidence: Number,
        estimatedQuantity: Number,
        macros: mongoose.Schema.Types.Mixed
      }
    ],
    error: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecognitionJob", recognitionJobSchema);

