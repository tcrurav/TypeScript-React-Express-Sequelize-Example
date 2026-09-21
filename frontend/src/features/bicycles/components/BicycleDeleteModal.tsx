import { useEffect, useId, useRef } from 'react'
import Button from '../../../components/ui/Button'
import type { Bicycle } from '../types/bicycle'

interface BicycleDeleteModalProps {
    bicycle: Bicycle
    deleting: boolean
    onConfirm: () => void
    onClose: () => void
}

function BicycleDeleteModal({ bicycle, deleting, onConfirm, onClose }: BicycleDeleteModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const titleId = useId()
    const descriptionId = useId()

    useEffect(() => {
        const dialog = dialogRef.current
        dialog?.showModal()
        return () => dialog?.close()
    }, [])

    return (
        <dialog ref={dialogRef} aria-labelledby={titleId} aria-describedby={descriptionId}
            aria-busy={deleting}
            className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl backdrop:bg-black/50"
            onCancel={(event) => {
                event.preventDefault()
                if (!deleting) onClose()
            }}>
            <h2 id={titleId} className="mb-4 text-xl font-bold">Eliminar bicicleta</h2>
            <p id={descriptionId} className="mb-6">
                ¿Quieres eliminar la bicicleta <strong>{bicycle.brand} {bicycle.model}</strong>?
                {' '}Esta acción no se puede deshacer.
            </p>
            {deleting && <p role="status" className="mb-4">Eliminando bicicleta...</p>}
            <div className="flex justify-end gap-2">
                <Button autoFocus type="button" variant="secondary" disabled={deleting}
                    onClick={onClose} className="rounded px-4 py-2 disabled:opacity-50">
                    Cancelar
                </Button>
                <Button type="button" variant="danger" disabled={deleting}
                    onClick={onConfirm} className="rounded px-4 py-2 disabled:opacity-50">
                    {deleting ? 'Eliminando...' : 'Eliminar'}
                </Button>
            </div>
        </dialog>
    )
}

export default BicycleDeleteModal
