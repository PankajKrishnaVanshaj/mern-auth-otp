import mongoose from "mongoose";
import bcrypt from "bcrypt";

const verificationSchema = new mongoose.Schema(
  {
    email: { required: true, type: String },
    otp: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

//  otp password
verificationSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) {
    next();
  }

  this.otp = await bcrypt.hash(this.otp, 10);
});

// compare password
verificationSchema.methods.compareOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

export const VerificationModel = mongoose.model(
  "Verification",
  verificationSchema
);
