import { useEffect, useState } from 'react';
import { Plus, ArrowUpCircle, ArrowDownCircle, Calendar, CreditCard } from 'lucide-react';
import api from '../services/api';
import TransactionModal from '../components/TransactionModal';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions'); // Precisamos criar esse GET no Go
      setTransactions(response.data || []);
    } catch (err) {
      console.error("Erro ao carregar transações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transações</h1>
          <p className="text-slate-500 text-sm">Gerencie seus gastos e ganhos mensais</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      <div className="grid gap-4">
        {transactions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">Nenhuma transação encontrada.</p>
          </div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {t.type === 'income' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{t.description}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(t.date).toLocaleDateString()}</span>
                    {t.is_credit_card && (
                      <span className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                        <CreditCard size={12} /> {t.installment_number}/{t.total_installments}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-lg font-bold ${t.type === 'income' ? 'text-green-600' : 'text-slate-800'}`}>
                  {t.type === 'income' ? '+' : '-'} €{t.amount.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">Confirmado</p>
              </div>
            </div>
          ))
        )}
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTransactions}
      />
    </div>
  );
}