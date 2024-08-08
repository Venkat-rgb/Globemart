import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "Please enter access token!"],
  },
  expiresAt: {
    type: Date,
    required: [true, "Please enter access token expiration time!"],
  },
});

// Creating a TTL index for automatic expiry and deletion
blacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const BlacklistToken = mongoose.model(
  "BlacklistToken",
  blacklistTokenSchema
);
