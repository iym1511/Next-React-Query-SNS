import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // 공통으로 쓰는 css
import MSWComponent from "./_component/MSWComponent";
import AuthSession from "./_component/AuthSession";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Z. 무슨 일이 일어나고 있나요? / Z",
  description: "Z.com inspired by X.com",
};

// 페이지를 넘나드는데도 안바뀌는 루트 레이아웃(최상위 레이아웃)
// page가 {children}안에 있다고 생각
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MSWComponent />
        <AuthSession>
          {children}
        </AuthSession>
      </body>
    </html>
  );
}
