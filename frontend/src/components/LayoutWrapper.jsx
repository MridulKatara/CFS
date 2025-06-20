import React from "react"
import BottomNavigation from "./buttomNavItem"


export default function LayoutWrapper({ children }) {

  const bottomPadding = "pb-16" 

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col w-full max-w-md mx-auto shadow-lg">
      <main className={`flex-grow overflow-y-auto ${bottomPadding} px-4 pt-4 bg-white`}>{children}</main>
      <BottomNavigation />
    </div>
  )
}
