import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const now = new Date();
        // Chamada para o endpoint que criámos no Go
        const response = await api.get(`/dashboard/summary?month=${now.getMonth() + 1}&year=${now.getFullYear()}`);
        setData(response.data);
      } catch (err) {
        console.error("Erro ao procurar dados do dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) return <div className="p-8">A carregar resumo...</div>;
  if (!data) return <div className="p-8">Nenhum dado encontrado para este mês.</div>;

  const chartData = [
    { name: 'Essencial (50%)', value: data.rule_50.total, color: '#3b82f6' },
    { name: 'Lazer (30%)', value: data.rule_30.total, color: '#22c55e' },
    { name: 'Metas (20%)', value: data.rule_20.total, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Resumo Mensal</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg"><TrendingUp /></div>
            <div>
              <p className="text-sm text-slate-500">Receitas</p>
              <p className="text-2xl font-bold">€{data.total_income.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg"><TrendingDown /></div>
            <div>
              <p className="text-sm text-slate-500">Despesas</p>
              <p className="text-2xl font-bold">€{data.total_expenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><DollarSign /></div>
            <div>
              <p className="text-sm text-slate-500">Saldo Disponível</p>
              <p className="text-2xl font-bold">€{data.balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico da Regra 50/30/20 */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-6">Distribuição 50/30/20</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}