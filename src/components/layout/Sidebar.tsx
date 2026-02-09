import { menuItems } from "./menuConfig"

type SidebarProps = {
  role: string
}

const Sidebar = ({ role }: SidebarProps) => {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-slate-200">
      
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="text-xl font-bold tracking-wide text-white">
          EMS-Netpair<span className="text-indigo-400">.</span>
        </span>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menuItems
          .filter(item => item.roles.includes(role))
          .map(item => (
            <div
              key={item.path}
              className="
                px-4 py-3 rounded-xl cursor-pointer
                bg-white/5 backdrop-blur
                hover:bg-white/10
                transition-all duration-200
                font-medium
              "
            >
              {item.label}
            </div>
          ))}
      </nav>
    </aside>
  )
}

export default Sidebar
