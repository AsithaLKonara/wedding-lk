import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Payment } from '@/lib/models';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { paymentId, userId } = await request.json();
    
    if (!paymentId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Payment ID and User ID are required'
      }, { status: 400 });
    }

    // Get payment details
    const payment = await Payment.findById(paymentId).populate('user vendor booking');
    
    if (!payment) {
      return NextResponse.json({
        success: false,
        error: 'Payment not found'
      }, { status: 404 });
    }

    // Generate PDF invoice
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    // Add fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Invoice header
    page.drawText('WEDDINGLK INVOICE', {
      x: 50,
      y: height - 50,
      size: 24,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    // Invoice details
    page.drawText(`Invoice #: ${payment.invoiceNumber || payment._id}`, {
      x: 50,
      y: height - 100,
      size: 12,
      font: font,
    });
    
    page.drawText(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, {
      x: 50,
      y: height - 120,
      size: 12,
      font: font,
    });
    
    // Customer details
    page.drawText('Bill To:', {
      x: 50,
      y: height - 160,
      size: 14,
      font: boldFont,
    });
    
    page.drawText(payment.user?.name || 'Customer', {
      x: 50,
      y: height - 180,
      size: 12,
      font: font,
    });
    
    page.drawText(payment.user?.email || '', {
      x: 50,
      y: height - 200,
      size: 12,
      font: font,
    });
    
    // Service details
    page.drawText('Service Details:', {
      x: 50,
      y: height - 240,
      size: 14,
      font: boldFont,
    });
    
    page.drawText(payment.description || 'Wedding Service', {
      x: 50,
      y: height - 260,
      size: 12,
      font: font,
    });
    
    // Amount details
    page.drawText(`Amount: LKR ${payment.amount?.toLocaleString() || '0'}`, {
      x: 50,
      y: height - 300,
      size: 12,
      font: font,
    });
    
    page.drawText(`Status: ${payment.status || 'Completed'}`, {
      x: 50,
      y: height - 320,
      size: 12,
      font: font,
    });
    
    // Footer
    page.drawText('Thank you for choosing WeddingLK!', {
      x: 50,
      y: 50,
      size: 12,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${payment._id}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate invoice'
    }, { status: 500 });
  }
}
