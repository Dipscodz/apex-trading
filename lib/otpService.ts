import crypto from "crypto";

const OTP_EXPIRY_MS = 5 * 60 * 1000;

type OTPRecord = {
  hash: string;
  expiresAt: number;
  attempts: number;
};

type OTPStore = Map<string, OTPRecord>;

// Store the OTP data on globalThis so both Next.js API routes
// share the same OTP store during local development.
const globalForOTP = globalThis as typeof globalThis & {
  __apexQuantumOTPStore?: OTPStore;
};

const otpStore: OTPStore =
  globalForOTP.__apexQuantumOTPStore ??
  new Map<string, OTPRecord>();

globalForOTP.__apexQuantumOTPStore = otpStore;

function hashOTP(email: string, otp: string) {
  return crypto
    .createHmac(
      "sha256",
      process.env.OTP_SECRET || "development-secret"
    )
    .update(`${email}:${otp}`)
    .digest("hex");
}

export function generateOTP(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  otpStore.set(normalizedEmail, {
    hash: hashOTP(normalizedEmail, otp),
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  });

  console.log(
    `🔒 [EMAIL OTP] Generated 6-digit OTP for ${normalizedEmail}: >>> ${otp} <<< (Expires in 5 mins)`
  );

  return otp;
}

export function verifyOTP(
  email: string,
  otp: string
) {
  const key = email.toLowerCase().trim();

  const record = otpStore.get(key);

  if (!record) {
    return {
      success: false,
      message:
        "OTP not found. Please request a new OTP.",
    };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);

    return {
      success: false,
      message:
        "OTP has expired. Please request a new OTP.",
    };
  }

  if (record.attempts >= 5) {
    otpStore.delete(key);

    return {
      success: false,
      message:
        "Too many incorrect attempts. Please request a new OTP.",
    };
  }

  const submittedHash = hashOTP(key, otp);

  if (submittedHash !== record.hash) {
    record.attempts += 1;

    return {
      success: false,
      message: "Invalid OTP.",
    };
  }

  // OTP is valid, so remove it immediately.
  otpStore.delete(key);

  return {
    success: true,
    message: "OTP verified successfully.",
  };
}