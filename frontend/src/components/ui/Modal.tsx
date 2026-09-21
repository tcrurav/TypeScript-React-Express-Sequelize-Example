import type { ReactNode } from 'react'
import Button from './Button'

interface ModalProps {
    title: string
    children: ReactNode
    onClose: () => void
}

function Modal({
    title,
    children,
    onClose,
}: ModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <div className="mt-4">{children}</div>
                </div>
                <div className="bg-gray-100 px-6 py-4 rounded-b-lg">
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default Modal
