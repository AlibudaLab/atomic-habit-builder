/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog'
import { handle } from 'frog/next'
import { NEXT_PUBLIC_URL } from '../config'
 
const app = new Frog({ 
  basePath: '/api/frame',
  title: 'Atomic Frame',
})
 
export const runtime = 'edge'
 
app.frame('/activity', (c) => {
  const url = new URL(c.req.url)
  const searchParams = url.searchParams
  searchParams.delete('routes')
  const imageSearchParams = new URLSearchParams(searchParams)
  const imageUrl = `${NEXT_PUBLIC_URL}/frame/activity?${imageSearchParams.toString()}`
  return c.res({
    image: imageUrl,
    intents: [
      <Button value="join">Feature Coming Soon...</Button>,
    ]
  })
})
 
export const GET = handle(app)
export const POST = handle(app)