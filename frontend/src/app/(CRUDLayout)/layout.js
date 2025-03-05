"use client";
import "../globals.css";
import AuthContext from "@/context/AuthContext";
export default function AuthLayout({ children }) {
  return (
    <html>
      <body>
        <main>
          <AuthContext>{children}</AuthContext>
        </main>
      </body>
    </html>
  );
}
