import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger'
}

const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
}

function Button({
    variant = 'primary',
    className = '',
    children,
    ...props
}: ButtonProps) {
    const variantClasses = variants[variant] || ''
    const combinedClasses = `${variantClasses} ${className}`.trim()

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    )
}

export default Button