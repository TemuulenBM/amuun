import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-sanity-secret');
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const type = body?._type;
  if (typeof type === 'string') revalidateTag(type, 'default');
  return NextResponse.json({ ok: true, type });
}
