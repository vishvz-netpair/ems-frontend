import type { ReactNode } from "react"

type ModalProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

const Modal = ({ open, title, onClose, children, footer }: ModalProps) => {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
    
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div className="relative w-[92%] max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200">
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        
        <div className="px-5 py-4">{children}</div>

        
        {footer ? (
          <div className="px-5 py-4 border-t border-slate-200">{footer}</div>
        ) : null}
      </div>
    </div>
  )
}

export default Modal
