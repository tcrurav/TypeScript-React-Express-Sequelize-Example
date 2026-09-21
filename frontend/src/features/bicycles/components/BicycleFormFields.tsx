export interface BicycleFormValues {
    brand: string
    model: string
    description: string
    price: string
    stock: string
}

interface BicycleFormFieldsProps {
    values: BicycleFormValues
    onChange: (field: keyof BicycleFormValues, value: string) => void
    disabled?: boolean
}

function updateValidationMessage(input: HTMLInputElement) {
    input.setCustomValidity('')
    const { validity, name } = input
    let message = ''

    if (validity.badInput) {
        message = 'Introduce un número válido.'
    } else if (validity.valueMissing) {
        const requiredMessages: Record<string, string> = {
            brand: 'Introduce la marca de la bicicleta.',
            model: 'Introduce el modelo de la bicicleta.',
            price: 'Introduce el precio de la bicicleta.',
            stock: 'Introduce la cantidad de existencias.',
        }
        message = requiredMessages[name] ?? 'Completa este campo.'
    } else if (validity.patternMismatch) {
        message = name === 'brand'
            ? 'La marca no puede contener solo espacios.'
            : 'El modelo no puede contener solo espacios.'
    } else if (validity.tooLong) {
        message = 'Introduce un máximo de 150 caracteres.'
    } else if (validity.rangeUnderflow) {
        message = name === 'price'
            ? 'El precio debe ser mayor o igual que 0.'
            : 'Las existencias deben ser mayores o iguales que 0.'
    } else if (validity.rangeOverflow) {
        message = name === 'price'
            ? 'El precio no puede superar 99.999.999,99 €.'
            : 'Las existencias no pueden superar 4.294.967.295 unidades.'
    } else if (validity.stepMismatch) {
        message = name === 'price'
            ? 'Introduce un precio con un máximo de dos decimales.'
            : 'Introduce un número entero de existencias.'
    }

    input.setCustomValidity(message)
}

function BicycleFormFields({ values, onChange, disabled }: BicycleFormFieldsProps) {
    const inputClass = 'mt-1 w-full rounded border border-gray-300 p-2'

    return (
        <fieldset disabled={disabled} className="space-y-4 disabled:opacity-60"
            onInvalid={(event) => {
                if (event.target instanceof HTMLInputElement) updateValidationMessage(event.target)
            }}
            onInput={(event) => {
                if (event.target instanceof HTMLInputElement) updateValidationMessage(event.target)
            }}>
            <label className="block">
                Marca
                <input autoFocus name="brand" required maxLength={150} pattern=".*\S.*"
                    className={inputClass} value={values.brand}
                    onChange={(event) => onChange('brand', event.target.value)} />
            </label>
            <label className="block">
                Modelo
                <input name="model" required maxLength={150} pattern=".*\S.*"
                    className={inputClass} value={values.model}
                    onChange={(event) => onChange('model', event.target.value)} />
            </label>
            <label className="block">
                Descripción (opcional)
                <textarea name="description" rows={3} className={inputClass}
                    value={values.description}
                    onChange={(event) => onChange('description', event.target.value)} />
            </label>
            <label className="block">
                Precio (€)
                <input name="price" type="number" required min="0" max="99999999.99" step="0.01"
                    className={inputClass} value={values.price}
                    onChange={(event) => onChange('price', event.target.value)} />
            </label>
            <label className="block">
                Existencias
                <input name="stock" type="number" required min="0" max="4294967295" step="1"
                    className={inputClass} value={values.stock}
                    onChange={(event) => onChange('stock', event.target.value)} />
            </label>
        </fieldset>
    )
}

export default BicycleFormFields
