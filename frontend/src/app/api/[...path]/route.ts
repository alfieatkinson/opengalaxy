// src/app/api/[...path]/route.ts

import { NextRequest, NextResponse } from 'next/server'

const proxy = async (req: NextRequest) => {
  const backend = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'

  console.log('Request to backend:', backend)

  const { pathname, search } = req.nextUrl
  const url = `${backend}${pathname}${search}`

  console.log('Proxied URL:', url)

  const response = await fetch(url, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
  })

  const headers: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    headers[key] = value
  })

  return new NextResponse(response.body, {
    status: response.status,
    headers,
  })
}

// Named exports for each method you want to handle
export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const DELETE = proxy
export const PATCH = proxy
