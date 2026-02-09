import Modal from "./Modal"

type ConfirmDialogProps = {
  open: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

const ConfirmDialog = ({
  open,
  title = "Confirm",
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) => {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              danger
                ? "px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                : "px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            }
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="text-slate-700">{message}</p>
    </Modal>
  )
}

export default ConfirmDialog
