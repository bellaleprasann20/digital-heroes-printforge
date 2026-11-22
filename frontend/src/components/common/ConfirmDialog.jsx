
import React from 'react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Please confirm that you want to continue.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
  icon = '!',
}) {
  const handleConfirm = async () => {
    if (loading) return;
    await onConfirm?.();
  };

  const handleClose = () => {
    if (!loading) {
      onClose?.();
    }
  };

  const iconStyles =
    variant === 'danger'
      ? 'bg-red-50 text-red-600'
      : variant === 'warning'
        ? 'bg-amber-50 text-amber-600'
        : 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="sm"
      showCloseButton={false}
      closeOnBackdrop={!loading}
      className="rounded-2xl"
      footer={
        <>
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="md"
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${iconStyles}`}
          aria-hidden="true"
        >
          {icon}
        </div>

        <h2 className="text-xl font-bold text-[var(--color-heading)]">
          {title}
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--color-text)]">
          {message}
        </p>
      </div>
    </Modal>
  );
}
