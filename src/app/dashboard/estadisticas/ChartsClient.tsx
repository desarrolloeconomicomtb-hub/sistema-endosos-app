'use client';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#2e5e2e', '#1b3d1b', '#4caf50', '#81c784', '#aed581', '#cddc39'];

export default function ChartsClient({ 
  dataCategoria, 
  dataEvento,
  dataPagos
}: { 
  dataCategoria: any[], 
  dataEvento: any[],
  dataPagos: any[]
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Gráfico de Barras: Eventos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-6 text-lg">Endosos Totales por Evento</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataEvento} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <RechartsTooltip cursor={{ fill: '#f5f5f5' }} />
              <Bar dataKey="value" fill="#2e5e2e" radius={[4, 4, 0, 0]} name="Endosos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Pastel: Categorías */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-6 text-lg">Endosos por Categoría</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dataCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Pagos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
        <h3 className="font-bold text-gray-800 mb-6 text-lg">Estado de Pagos por Evento</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataPagos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <RechartsTooltip cursor={{ fill: '#f5f5f5' }} />
              <Legend />
              <Bar dataKey="Pagados" stackId="a" fill="#4caf50" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Exentos" stackId="a" fill="#2196f3" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Pendientes" stackId="a" fill="#ef5350" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
