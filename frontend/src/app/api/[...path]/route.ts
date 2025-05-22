// src/app/api/[...path]/route.ts

import { NextRequest, NextResponse } from 'next/server'

interface RequestInitWithDuplex extends RequestInit {
  duplex?: 'half'
}

const proxy = async (req: NextRequest) => {
  const backend = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'

  const { pathname, search } = req.nextUrl
  const url = `${backend}${pathname}${search}`

  console.log(`Proxying request to: ${url}`)

  // Prepare fetch options
  const fetchOptions: RequestInitWithDuplex = {
    method: req.method,
    headers: req.headers,
  }

  if (!['GET', 'HEAD'].includes(req.method)) {
    fetchOptions.body = req.body
    fetchOptions.duplex = 'half' // required for streaming bodies in Node.js fetch
  }

  const response = await fetch(url, fetchOptions)

  // Clone headers to plain object for NextResponse
  const headers: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    headers[key] = value
  })

  return new NextResponse(response.body, {
    status: response.status,
    headers,
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const DELETE = proxy
export const PATCH = proxy
