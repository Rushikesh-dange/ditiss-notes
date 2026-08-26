import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Verify user credentials
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 3. Save to DB
    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiry }
    });

    // 4. Send via Email
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"DITISS Notes Admin" <${process.env.SMTP_USER}>`,
        to: email, // Sending to the admin attempting to login
        subject: `Your Admin Login Verification Code`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Admin Login Verification</h2>
            <p>You are attempting to log into the DITISS Notes admin panel.</p>
            <p>Your one-time verification code is:</p>
            <h1 style="background: #f4f4f4; padding: 10px 20px; letter-spacing: 5px; display: inline-block; border-radius: 5px;">${otp}</h1>
            <p>This code will expire in 5 minutes.</p>
            <p style="color: #666; font-size: 12px;">If you did not request this code, please ignore this email and consider changing your password.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.warn("SMTP not configured. OTP generated but not sent: ", otp);
      // In a real prod environment we'd return 500, but for local testing without SMTP it's helpful to see it
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
