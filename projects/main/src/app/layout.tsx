import './globals.css'

export default async function RootLayout({ children }: Core.Layout) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
