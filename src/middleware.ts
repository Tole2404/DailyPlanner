import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // App sekarang berjalan tanpa login, jadi middleware tidak mengunci route apa pun.
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
