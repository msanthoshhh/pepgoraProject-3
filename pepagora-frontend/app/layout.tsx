
import "./globals.css";

export const metadata = {
  title: "Your App Title",
  icons: {
    icon: "/blank-icon.png", // <- add a blank PNG to /public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
