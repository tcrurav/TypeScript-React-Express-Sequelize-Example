import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../../../components/ui/Button'
import type { Bicycle, BicyclePayload } from '../types/bicycle'
import BicycleFormFields from './BicycleFormFields'
import type { BicycleFormValues } from './BicycleFormFields'

interface BicycleFormProps {
    bicycle: Bicycle | null
    onSave: (payload: BicyclePayload) => Promise<void>
    onCancel: () => void
    onSavingChange: (saving: boolean) => void
}

function BicycleForm({ bicycle, onSave, onCancel, onSavingChange }: BicycleFormProps) {
    const [values, setValues] = useState<BicycleFormValues>(() => ({
        brand: bicycle?.brand ?? '',
        model: bicycle?.model ?? '',
        description: bicycle?.description ?? '',
        price: bicycle ? String(bicycle.price) : '',
        stock: String(bicycle?.stock ?? 0),
    }))
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const submitting = useRef(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (submitting.current) return

        const payload: BicyclePayload = {
            brand: values.brand.trim(),
            model: values.model.trim(),
            description: values.description.trim() || null,
            price: Number(values.price),
            stock: Number(values.stock),
        }

        if (!payload.brand || !payload.model || !values.price.trim() || !values.stock.trim()
            || !Number.isFinite(payload.price) || payload.price < 0 || payload.price > 99999999.99
            || !Number.isInteger(payload.stock) || payload.stock < 0 || payload.stock > 4294967295) {
            setError('Revisa la marca, el modelo, el precio y las existencias.')
            return
        }

        submitting.current = true
        setSaving(true)
        onSavingChange(true)
        setError(null)
        try {
            await onSave(payload)
        } catch {
            setError('No se pudo guardar la bicicleta. Inténtalo de nuevo.')
        } finally {
            submitting.current = false
            setSaving(false)
            onSavingChange(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4" aria-busy={saving}>
            <BicycleFormFields values={values} disabled={saving}
                onChange={(field, value) => setValues((previous) => ({ ...previous, [field]: value }))} />
            {error && <p role="alert" className="text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" disabled={saving} onClick={onCancel}
                    className="rounded px-4 py-2 disabled:opacity-50">Cancelar</Button>
                <Button type="submit" disabled={saving} className="rounded px-4 py-2 disabled:opacity-50">
                    {saving ? 'Guardando...' : bicycle ? 'Guardar cambios' : 'Crear bicicleta'}
                </Button>
            </div>
        </form>
    )
}

export default BicycleForm
