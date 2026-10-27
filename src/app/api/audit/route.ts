import { NextRequest, NextResponse } from 'next/server';
import { AuditRequestPayload } from '@/types/brandVault';
import { executeHybridAudit } from '@/lib/auditEngine';

export async function POST(req: NextRequest) {
  try {
    const body: AuditRequestPayload = await req.json();

    if (!body || typeof body.content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid request: content string is required' },
        { status: 400 }
      );
    }

    const result = await executeHybridAudit(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal audit processing error',
      },
      { status: 500 }
    );
  }
}

