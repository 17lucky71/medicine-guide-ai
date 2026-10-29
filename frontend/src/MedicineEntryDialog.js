import { useEffect, useRef } from 'react';

export default function MedicineEntryDialog({ method, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    dialogRef.current.scrollTop = 0;
    if (method === 'name') dialogRef.current.querySelector('input[type="search"]')?.focus();
  }, [method]);

  return (
    <dialog
      ref={dialogRef}
      className="entry-dialog"
      aria-labelledby="entry-dialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      }}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.target === event.currentTarget && (
          event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom
        )) onClose();
      }}
    >
      <header className="dialog-heading">
        <h2 id="entry-dialog-title">{method === 'photo' ? '사진으로 추가' : '이름으로 추가'}</h2>
        <button className="dialog-close" type="button" onClick={onClose} aria-label="입력 창 닫기">×</button>
      </header>
      {children}
    </dialog>
  );
}
