// home의 레이아웃
export default async function AfterLoginLayout({children}: any) {
  return (
    <div>
      afterLogin 레이아웃
      {children}
    </div>
  )
}