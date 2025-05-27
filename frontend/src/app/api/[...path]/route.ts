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
    headers: new Headers({
      // Copy all incoming headers except the host
      ...Object.fromEntries(req.headers.entries()),
      // Explicitly forward the cookie header
      cookie: req.headers.get('cookie') || '',
    }),
    // For non-GET/HEAD:
    ...(!['GET', 'HEAD'].includes(req.method) && {
      body: req.body,
      duplex: 'half',
    }),
  }

  if (!['GET', 'HEAD'].includes(req.method)) {
    fetchOptions.body = req.body
    fetchOptions.duplex = 'half' // required for streaming bodies in Node.js fetch
  }

  // Call the backend
  const backendResponse = await fetch(url, fetchOptions)

  // Build your NextResponse
  const response = new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    // Copy everything except set-cookie
    headers: Object.fromEntries(
      [...backendResponse.headers.entries()].filter(([k]) => k.toLowerCase() !== 'set-cookie'),
    ),
  })

  // Now append any set-cookie headers so the browser will see them
  const setCookie = backendResponse.headers.get('set-cookie')
  if (setCookie) response.headers.append('set-cookie', setCookie)

  return response
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE, proxy as PATCH }
