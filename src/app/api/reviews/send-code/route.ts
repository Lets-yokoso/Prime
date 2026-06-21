import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCode } from "@/lib/utils";
import { sendVerificationCode } from "@/lib/email";
import { validateEmail } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const emailErr = validateEmail(email);
    if (emailErr) {
      return NextResponse.json({ error: emailErr }, { status: 400 });
    }

    const code = generateCode();

    await prisma.emailVerification.create({
      data: {
        email: email.toLowerCase().trim(),
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    const sent = await sendVerificationCode(email, code);
    if (!sent) {
      return NextResponse.json({ error: "Failed to send email. Check SMTP settings." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
