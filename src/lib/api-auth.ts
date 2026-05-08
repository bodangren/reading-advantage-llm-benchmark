import { NextRequest, NextResponse } from 'next/server';
import { isValidApiKey } from './api-keys';
import { checkRateLimit } from './rate-limit';

export interface AuthResult {
  allowed: boolean;
  error?: string;
  status?: number;
}

export async function validateAuth(request: NextRequest): Promise<AuthResult> {
  const apiKey = request.headers.get('x-api-key');

  if (!isValidApiKey(apiKey)) {
    return {
      allowed: false,
      error: 'Invalid or missing API key',
      status: 401,
    };
  }

  const rateLimitResult = await checkRateLimit(apiKey!);

  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
    return {
      allowed: false,
      error: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
      status: 429,
    };
  }

  return { allowed: true };
}

export function authResponse(error: string, status: number): NextResponse {
  const headers: Record<string, string> = {};

  if (status === 429) {
    headers['Retry-After'] = '3600';
  }

  return NextResponse.json(
    { error },
    { status, headers }
  );
}