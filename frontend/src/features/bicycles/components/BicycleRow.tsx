import Button from '../../../components/ui/Button'
import type { Bicycle } from '../types/bicycle'

interface BicycleRowProps {
    bicycle: Bicycle
    onEdit?: (id: number) => void
    onDelete?: (id: number) => void
}

function BicycleRow({
    bicycle,
    onEdit,
    onDelete,
}: BicycleRowProps) {
    return (
        <li className={`grid min-w-0 gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50 lg:items-center lg:rounded-none lg:border-0 lg:border-b lg:shadow-none lg:last:border-b-0 ${
            onEdit || onDelete ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
        }`}>
            <dl className="grid min-w-0 grid-cols-2 gap-4 lg:contents">
                <div className="min-w-0">
                    <dt className="mb-1 text-sm text-gray-600 lg:sr-only">Marca</dt>
                    <dd className="font-semibold [overflow-wrap:anywhere]">{bicycle.brand}</dd>
                </div>
                <div className="min-w-0">
                    <dt className="mb-1 text-sm text-gray-600 lg:sr-only">Modelo</dt>
                    <dd className="[overflow-wrap:anywhere]">{bicycle.model}</dd>
                </div>
                <div className="min-w-0">
                    <dt className="mb-1 text-sm text-gray-600 lg:sr-only">Precio</dt>
                    <dd className="[overflow-wrap:anywhere]">{Number(bicycle.price).toFixed(2)} €</dd>
                </div>
                <div className="min-w-0">
                    <dt className="mb-1 text-sm text-gray-600 lg:sr-only">Existencias</dt>
                    <dd className="[overflow-wrap:anywhere]">{bicycle.stock}</dd>
                </div>
            </dl>
            {(onEdit || onDelete) && (
                <div className="flex min-w-0 flex-wrap gap-2 border-t border-gray-100 pt-4 lg:border-0 lg:pt-0">
                    {onEdit && <Button type="button" variant="secondary"
                        className="min-h-11 flex-1 rounded px-3 py-2 lg:flex-none"
                        aria-label={`Editar ${bicycle.brand} ${bicycle.model}`}
                        onClick={() => onEdit(bicycle.id)}>Editar</Button>}
                    {onDelete && <Button type="button" variant="danger"
                        className="min-h-11 flex-1 rounded px-3 py-2 lg:flex-none"
                        aria-label={`Eliminar ${bicycle.brand} ${bicycle.model}`}
                        onClick={() => onDelete(bicycle.id)}>Eliminar</Button>}
                </div>
            )}
        </li>
    )
}
export default BicycleRow
