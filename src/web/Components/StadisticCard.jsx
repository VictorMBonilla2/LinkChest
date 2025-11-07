import React from 'react'

/**
 * Tarjeta estadística.
 *
 * @param {Object} props
 * @param {{ label:string, number: number, color: string }} props.data - Objeto que contiene el número y el color.
 * @param {React.ReactNode} props.children - Componente React (por ejemplo, un icono de Lucide).
 * @returns {JSX.Element}
 */
export default function StadisticCard({data, children}) {

const colorClasses = {
  blue: "bg-blue-500/20 text-blue-500",
  red: "bg-red-500/20 text-red-500",
  green: "bg-green-500/20 text-green-500",
  yellow: "bg-yellow-500/20 text-yellow-500",
  purple: "bg-purple-500/20 text-purple-500",
  orange: "bg-orange-500/20 text-orange-500",
};
    // color proviene de tus props o datos
    const colorIcon = colorClasses[data.color] || "bg-gray-500/20 text-gray-500";


    return (
        <div data-slot="card" className="text-card-foreground flex flex-col gap-6 rounded-xl border bg-[#252837] border-gray-700 p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-400 text-sm">{data.label}</p>
                    <p class="text-white text-2xl mt-1">{data.number}</p>
                </div>
                <div class={`w-10 h-10 rounded-lg flex items-center justify-center ${colorIcon}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}
