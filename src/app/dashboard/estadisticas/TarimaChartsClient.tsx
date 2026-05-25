'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TarimaChartsClient({ dataTarima, dataPagosTarima }: { dataTarima: any[], dataPagosTarima: any[] }) {
  if (dataTarima.length === 0) {
    return <div className="mt-12 text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">No hay negocios registrados para este evento.</div>;
  }

  return (
    <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Distribución de Negocios por Tarima</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataTarima} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{fill: '#6b7280'}} tickLine={false} axisLine={{stroke: '#e5e7eb'}} />
              <YAxis allowDecimals={false} tick={{fill: '#6b7280'}} tickLine={false} axisLine={false} />
              <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Negocios" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Estatus de Pagos por Tarima</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataPagosTarima} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{fill: '#6b7280'}} tickLine={false} axisLine={{stroke: '#e5e7eb'}} />
              <YAxis allowDecimals={false} tick={{fill: '#6b7280'}} tickLine={false} axisLine={false} />
              <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
              <Legend wrapperStyle={{paddingTop: '20px'}} />
              <Bar dataKey="Pagados" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Exentos" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Pendientes" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
