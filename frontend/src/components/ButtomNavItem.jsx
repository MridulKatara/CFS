import { NavLink } from "react-router-dom"
import { Home, LayoutGrid, Bell, User } from "lucide-react"
import React from "react"
const navItems = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/my-programs", label: "My Programs", icon: LayoutGrid },
  { path: "/notifications", label: "Notification", icon: Bell },
  { path: "/profile", label: "Profile", icon: User },
]

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-brand-border flex justify-around items-center shadow-bottom-nav max-w-md mx-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-1/4 h-full text-xs transition-colors
           ${isActive ? "text-brand-icon-active font-semibold" : "text-brand-icon-inactive hover:text-brand-purple-medium"}`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? "text-brand-purple" : "text-brand-icon-inactive"}
              />
              <span className={`mt-0.5 ${isActive ? "text-brand-purple font-semibold" : "text-brand-icon-inactive"}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
