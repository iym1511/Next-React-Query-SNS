import { ReactNode } from "react";

type Prop = { children : ReactNode, modal : ReactNode };

// home의 레이아웃
export default async function HomeLayout({children}: Prop) {
  return (
    <div>
      홈 레이아웃
      {children}
    </div>
  )
}