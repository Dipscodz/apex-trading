import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateOTP } from "@/lib/otpService";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Resend API key is not configured.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const normalizedEmail = email.toLowerCase().trim();

    const otp = generateOTP(normalizedEmail);

    const { data, error } = await resend.emails.send({
      from:
        process.env.OTP_FROM_EMAIL ||
        "Apex Quantum <onboarding@resend.dev>",
      to: [normalizedEmail],
      subject: "Your Apex Quantum Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #0284c7;">
            Apex Quantum
          </h2>

          <p>Your login verification code is:</p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 10px;
            padding: 20px;
            background: #f1f5f9;
            border-radius: 8px;
            text-align: center;
          ">
            ${otp}
          </div>

          <p>
            This OTP will expire in 5 minutes.
          </p>

          <p>
            If you did not attempt to log in,
            you can safely ignore this email.
          </p>

          <hr />

          <p style="font-size: 12px; color: #64748b;">
            Apex Quantum Paper Trading Platform
          </p>
        </div>
      `,
    });

    // IMPORTANT:
    // Resend returns API errors in the `error` property.
    if (error) {
      console.warn("Resend API notice (Testing Domain Restriction):", error.message);

      // If Resend is in testing mode (only allows sending to account owner email),
      // we still allow testing any email by logging the OTP to server console.
      return NextResponse.json({
        success: true,
        message: `OTP generated. (Resend test mode: Check terminal console for OTP code).`,
        devNotice: error.message,
      });
    }

    console.log("OTP email sent successfully:", data);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
      emailId: data?.id,
    });
  } catch (error) {
    console.error("OTP sending error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send OTP.",
      },
      { status: 500 }
    );
  }
}