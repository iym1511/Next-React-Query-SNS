import { ReactNode } from "react";

type Prop = { children : ReactNode, modal : ReactNode };

// home의 레이아웃
export default async function AfterLoginLayout({children}: Prop) {
  return (
    <div>
      afterLogin 레이아웃
      {children}
    </div>
  )
}