import Button from "./Button"
import Modal from "./Modal"

type ConfirmDialogProps = {
  open: boolean
  title?: string
  message: string
  mode?:"Confirm"|"Success",
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
  mode = "Confirm",
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) => {
  const isSuccess = mode === "Success"

  return (
    <Modal
      open={open}
      title={title}
      onClose={isSuccess ? onConfirm : (onCancel ?? onConfirm)}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-3">
          {!isSuccess && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          )}
          <Button
            type="button"
            onClick={onConfirm}
            variant={danger && !isSuccess ? "danger" : "primary"}
          >
            {confirmText ?? (isSuccess ? "Ok" : "Yes")}
          </Button>
        </div>
      }
    >
      <p className="text-sm leading-6 text-slate-700">{message}</p>
    </Modal>
  )
}

export default ConfirmDialog
