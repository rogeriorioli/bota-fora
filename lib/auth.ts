import { NextRequest } from 'next/server';

export function validateAdminToken(req: NextRequest): boolean {
  const adminToken = process.env.ADMIN_TOKEN;
  const requestToken = req.headers.get('x-admin-token');

  if (!adminToken) {
    console.error('ADMIN_TOKEN is not configured in environment variables');
    return false;
  }

  return requestToken === adminToken;
}
