import { useEffect, useId, useRef, useState } from 'react'
import type { Bicycle, BicyclePayload } from '../types/bicycle'
import BicycleForm from './BicycleForm'

interface BicycleModalProps {
    bicycle: Bicycle | null
    onSave: (payload: BicyclePayload) => Promise<void>
    onClose: () => void
}

function BicycleModal({ bicycle, onSave, onClose }: BicycleModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const titleId = useId()
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const dialog = dialogRef.current
        dialog?.showModal()
        return () => dialog?.close()
    }, [])

    return (
        <dialog ref={dialogRef} aria-labelledby={titleId}
            className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl backdrop:bg-black/50"
            onCancel={(event) => {
                event.preventDefault()
                if (!saving) onClose()
            }}>
            <h2 id={titleId} className="mb-4 text-xl font-bold">
                {bicycle ? 'Editar bicicleta' : 'Nueva bicicleta'}
            </h2>
            <BicycleForm bicycle={bicycle} onSave={onSave} onCancel={onClose}
                onSavingChange={setSaving} />
        </dialog>
    )
}

export default BicycleModal
