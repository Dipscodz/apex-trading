import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
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

    const normalizedEmail = email.toLowerCase().trim();
    const otp = generateOTP(normalizedEmail);

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    // ============================================================
    // OPTION 1: GMAIL SMTP (Sends real emails to ANY address)
    // ============================================================
    if (gmailUser && gmailAppPassword) {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: gmailUser.trim(),
            pass: gmailAppPassword.replace(/\s+/g, ""), // strip any spaces
          },
        });

        await transporter.sendMail({
          from: `"Apex Quantum" <${gmailUser.trim()}>`,
          to: normalizedEmail,
          subject: "Your Apex Quantum Login OTP",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #0b0f19; color: #ffffff;">
              <h2 style="color: #0284c7; text-align: center; font-size: 24px;">Apex Quantum</h2>
              <p style="color: #cbd5e1; font-size: 14px;">Your login verification code is:</p>
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; padding: 20px; background-color: #1e293b; border-radius: 10px; text-align: center; color: #38bdf8; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #94a3b8; font-size: 13px;">This OTP will expire in 5 minutes.</p>
              <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
              <p style="font-size: 11px; color: #64748b; text-align: center;">Apex Quantum Institutional Trading Platform</p>
            </div>
          `,
        });

        console.log(`✅ [Gmail SMTP] OTP email sent successfully to ${normalizedEmail}`);

        return NextResponse.json({
          success: true,
          message: "OTP sent to your email via Gmail.",
          provider: "gmail",
        });
      } catch (gmailErr: any) {
        console.error("❌ Gmail SMTP error:", gmailErr);
        // Fallback or return error details if Gmail authentication failed
        if (!process.env.RESEND_API_KEY) {
          return NextResponse.json(
            {
              success: false,
              message: `Gmail SMTP Error: ${gmailErr.message || "Invalid Gmail App Password"}`,
            },
            { status: 500 }
          );
        }
      }
    }

    // ============================================================
    // OPTION 2: RESEND API (Fallback if RESEND_API_KEY is configured)
    // ============================================================
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
          from: process.env.OTP_FROM_EMAIL || "Apex Quantum <onboarding@resend.dev>",
          to: [normalizedEmail],
          subject: "Your Apex Quantum Login OTP",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #0b0f19; color: #ffffff;">
              <h2 style="color: #0284c7;">Apex Quantum</h2>
              <p>Your login verification code is:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 10px; padding: 20px; background: #1e293b; border-radius: 8px; text-align: center; color: #38bdf8;">
                ${otp}
              </div>
              <p>This OTP will expire in 5 minutes.</p>
            </div>
          `,
        });

        if (!error && data) {
          console.log(`✅ [Resend] OTP email sent successfully to ${normalizedEmail}`);
          return NextResponse.json({
            success: true,
            message: "OTP sent to your email via Resend.",
            emailId: data.id,
            provider: "resend",
          });
        }
      } catch (resendErr) {
        console.warn("Resend API fallback notice:", resendErr);
      }
    }

    // ============================================================
    // OPTION 3: DEV LOG (Always succeeds so local testing never blocks)
    // ============================================================
    return NextResponse.json({
      success: true,
      message: "OTP generated. (Check terminal console or add GMAIL_APP_PASSWORD).",
      provider: "dev_log",
    });
  } catch (error) {
    console.error("OTP route error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process OTP request.",
      },
      { status: 500 }
    );
  }
}