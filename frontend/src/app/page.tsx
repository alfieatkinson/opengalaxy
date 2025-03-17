'use client'

import { useState, useEffect } from 'react'

export default function HomePage() {
  const [data, setData] = useState<string | null>(null)

  useEffect(() => {
    // Fetch data from the backend using a GET request
    fetch("http://localhost:8000/test/")
      .then((res) => res.json())
      .then((data) => setData(data.data))
      .catch((error) => console.error("Error fetching data:", error))
  }, []) // Empty dependency array ensures this runs only once on component mount

  return (
    <div>
      <h1>Dockerised Full-Stack Template</h1>
      <h3>With Django, Next.js, Postgres, and Docker</h3>
      <p>{data ? data : "Loading data..."}</p> {/* Display data or loading message */}
    </div>
  )
}
