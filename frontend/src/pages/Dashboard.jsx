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
    { name: `Essencial (${data.rule_50.limit}%)`, value: data.rule_50.total, color: '#3b82f6' },
    { name: `Lazer (${data.rule_30.limit}%)`, value: data.rule_30.total, color: '#22c55e' },
    { name: `Metas (${data.rule_20.limit}%)`, value: data.rule_20.total, color: '#f59e0b' },
  ];

  // Cálculo de porcentagem total gasta em relação à receita
  const totalSpentPercent = data.total_income > 0 
    ? Math.round((data.total_expenses / data.total_income) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resumo Mensal</h1>
          <p className="text-slate-500">Acompanhamento da sua saúde financeira</p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico da Regra 50/30/20 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Distribuição Real</h3>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => `€${value.toLocaleString()}`} 
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            {/* Texto Centralizado */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800">{totalSpentPercent}%</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">Gasto</span>
            </div>
          </div>
        </div>

        {/* Comparativo de Limites (Barras de Progresso) */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-8">Uso dos Limites (50/30/20)</h3>
          
          <div className="space-y-8">
            {/* Barra Essencial */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Essencial</span>
                <span className={data.rule_50.percentage > data.rule_50.limit ? 'text-red-500 font-bold' : 'text-slate-500'}>
                  {data.rule_50.percentage.toFixed(1)}% / {data.rule_50.limit}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-700" 
                  style={{ width: `${Math.min(data.rule_50.percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Barra Lazer */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Lazer / Desejos</span>
                <span className={data.rule_30.percentage > data.rule_30.limit ? 'text-red-500 font-bold' : 'text-slate-500'}>
                  {data.rule_30.percentage.toFixed(1)}% / {data.rule_30.limit}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-700" 
                  style={{ width: `${Math.min(data.rule_30.percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Barra Metas */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Investimentos / Dívidas</span>
                <span className={data.rule_20.percentage > data.rule_20.limit ? 'text-red-500 font-bold' : 'text-slate-500'}>
                  {data.rule_20.percentage.toFixed(1)}% / {data.rule_20.limit}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-700" 
                  style={{ width: `${Math.min(data.rule_20.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}