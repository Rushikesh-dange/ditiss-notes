import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { studentName, email, institute, question } = await request.json();

    if (!studentName || !email || !institute || !question) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (studentName.length > 100 || email.length > 150 || institute.length > 200 || question.length > 3000) {
      return NextResponse.json({ error: 'Input exceeds maximum allowed length' }, { status: 400 });
    }

    // 1. Save message to database
    const message = await prisma.message.create({
      data: {
        studentName,
        email,
        institute,
        question
      }
    });

    // 2. Send Email via Nodemailer (if SMTP is configured)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"DITISS Notes" <${process.env.SMTP_USER}>`,
        to: 'self@rushikeshdange.online',
        subject: `New Contact Message from ${studentName}`,
        html: `
          <h3>New Message Received from DITISS Notes</h3>
          <p><strong>Student Name:</strong> ${studentName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Institute:</strong> ${institute}</p>
          <hr />
          <p><strong>Question/Message:</strong></p>
          <p>${question}</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to self@rushikeshdange.online");
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // We still return success because the message was saved to DB
      }
    } else {
      console.warn("SMTP credentials not configured. Message saved to DB only.");
    }

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
