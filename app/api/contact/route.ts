import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import * as z from "zod"

const contactSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5).max(100),
  message: z.string().min(10).max(1000)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactSchema.parse(body)
    
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Email to admin (you)
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          New Message from CartifyShop Portfolio
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #334155; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
        </div>
        
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #334155; margin-top: 0;">Subject</h3>
          <p>${validatedData.subject}</p>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #334155; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap;">${validatedData.message}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px;">
            This message was sent from your CartifyShop portfolio contact form.<br>
            Submitted on ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `

    // Confirmation email to user
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          Thanks for reaching out!
        </h2>
        
        <p>Hi ${validatedData.name},</p>
        
        <p>Thank you for your interest in my CartifyShop project! I've received your message and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #334155; margin-top: 0;">Your Message</h3>
          <p><strong>Subject:</strong> ${validatedData.subject}</p>
          <p style="white-space: pre-wrap; margin-top: 10px;">${validatedData.message}</p>
        </div>
        
        <p>In the meantime, feel free to:</p>
        <ul>
          <li>Explore the <a href="${process.env.NEXTAUTH_URL}" style="color: #2563eb;">live demo</a></li>
          <li>Check out the <a href="${process.env.NEXTAUTH_URL}/about" style="color: #2563eb;">project details</a></li>
          <li>Browse the <a href="${process.env.NEXTAUTH_URL}/products" style="color: #2563eb;">features</a></li>
        </ul>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px;">
            Best regards,<br>
            Rahul<br>
            Full-Stack Developer<br>
            <a href="${process.env.NEXTAUTH_URL}" style="color: #2563eb;">CartifyShop Portfolio</a>
          </p>
        </div>
      </div>
    `

    // Send email to you
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${validatedData.subject}`,
      html: adminEmailHtml,
      replyTo: validatedData.email
    })

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: validatedData.email,
      subject: "Thanks for your interest in CartifyShop!",
      html: userEmailHtml
    })

    return NextResponse.json({
      success: true,
      message: "Message sent successfully"
    })

  } catch (error) {
    console.error("Error sending email:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}