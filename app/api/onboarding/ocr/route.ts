import { NextResponse } from 'next/server';
import { callGemini, getGeminiApiKeys } from '@/lib/gemini-client';

export const maxDuration = 120; // Increased to 120 seconds for file processing

function getOcrApiKey(): string {
  return process.env.OCR_SPACE_API_KEY || 'helloworld';
}

// Simple Gemini extraction - shared client already tries both models across
// all configured keys before giving up
async function extractWithGemini(base64Data: string, mimeType: string): Promise<string> {
  const { text } = await callGemini('Extract all text from this document verbatim. Preserve formatting and structure.', {
    file: { mimeType, base64Data },
    temperature: 0.1,
    maxOutputTokens: 8192,
    timeoutMs: 45000,
  });

  if (!text || text.trim().length < 10) {
    throw new Error('Gemini returned insufficient text');
  }

  return text.trim();
}

// OCR.space fallback
async function extractWithOCR(base64Data: string, mimeType: string, fileName: string): Promise<string> {
  const OCR_API_KEY = getOcrApiKey();
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const formData = new FormData();
  formData.append('file', new Blob([bytes], { type: mimeType }), fileName);
  formData.append('apikey', OCR_API_KEY);
  formData.append('language', 'eng');
  formData.append('OCREngine', '2');

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  
  if (result.IsErroredOnProcessing) {
    throw new Error(`OCR failed: ${result.ErrorMessage}`);
  }

  const text = result.ParsedResults?.[0]?.ParsedText || '';
  if (!text) {
    throw new Error('No text found');
  }

  return text;
}

export async function POST(req: Request) {
  try {
    // Validate API keys at runtime
    if (getGeminiApiKeys().length === 0) {
      console.error('No Gemini API keys configured');
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    const contentType = file.type || '';
    const fileName = file.name || '';

    // Handle DOCX
    if (contentType.includes('wordprocessingml') || fileName.endsWith('.docx')) {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const { value } = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
        return NextResponse.json({ text: value || '' });
    }

    // Handle PDF/Images
    const isPDF = contentType === 'application/pdf';
    const isImage = contentType.startsWith('image/');

    if (!isPDF && !isImage) {
      return NextResponse.json(
        { error: 'Unsupported file type. Only PDF, images, and DOCX are supported.' },
        { status: 400 }
      );
    }

    // Convert to base64
        const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // Try Gemini models first (with fallback to OCR.space)
    try {
      const text = await extractWithGemini(base64Data, contentType);
      return NextResponse.json({ text });
    } catch (geminiError) {
      // All 3 Gemini models failed, try OCR.space as 4th fallback
      try {
        const text = await extractWithOCR(base64Data, contentType, fileName);
        return NextResponse.json({ text });
      } catch (ocrError) {
        // All methods failed - return error for retry modal
        return NextResponse.json({ 
          error: 'EXTRACTION_FAILED',
          message: 'Text extraction failed. Please try again or upload a different file.',
          details: `All extraction methods failed. Gemini: ${geminiError instanceof Error ? geminiError.message : 'Unknown'}. OCR: ${ocrError instanceof Error ? ocrError.message : 'Unknown'}`
        }, { status: 500 });
      }
    }
  } catch (error: any) {
    console.error('OCR route error:', error);
    const errorMessage = error?.message || 'Unexpected error';
    const errorStack = error?.stack;
    
    // Log more details in production for debugging
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: error?.name,
      type: typeof error
    });
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
