type HeaderProps = {
  user: {
    name: string
    role: string
  }
}

const Header = ({ user }: HeaderProps) => {
  return (
    <header className="h-16 bg-white/70 backdrop-blur border-b border-slate-200 flex items-center justify-between px-8">
      
      {/* Title */}
      <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
      
      </h1>

      {/* Profile Button */}
      <button
        className="
          flex items-center gap-3
          px-4 py-2 rounded-full
          bg-slate-100 hover:bg-slate-200
          transition
        "
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm">
          {user.name.charAt(0)}
        </div>

        <div className="text-left">
          <p className="text-sm font-medium text-slate-800">
            {user.name}
          </p>
          <p className="text-xs text-slate-500 capitalize">
            {user.role}
          </p>
        </div>
      </button>
    </header>
  )
}

export default Header
