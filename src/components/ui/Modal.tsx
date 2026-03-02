import type { ReactNode } from "react"

type ModalProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?:"sm"|"md"|"lg"
}

const Modal = ({ open, title, onClose, children, footer,size="md" }: ModalProps) => {
  if (!open) return null

  const sizeClass=
  size=="sm"
  ?"max-w-sm"
  :size=="lg"
  ?"max-w-3xl"
  :"max-w-lg"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${sizeClass} rounded-2xl bg-white shadow-xl border border-slate-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-slate-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal
