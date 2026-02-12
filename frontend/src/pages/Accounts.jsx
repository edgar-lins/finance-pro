import { useEffect, useState } from 'react';
import { Plus, Wallet, CreditCard, Banknote, MoreVertical } from 'lucide-react';
import api from '../services/api';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data || []);
    } catch (err) {
      console.error("Erro ao carregar contas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Minhas Contas</h1>
          <p className="text-slate-500 text-sm">Gerencie seus bancos, carteiras e cartões</p>
        </div>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Nova Conta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Carregando contas...</p>
        ) : accounts.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">Nenhuma conta cadastrada ainda.</p>
          </div>
        ) : (
          accounts.map((acc) => (
            <div key={acc.id} className="relative group overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              {/* Detalhe visual lateral baseado no tipo */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${acc.type === 'checking' ? 'bg-blue-500' : 'bg-purple-500'}`} />
              
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${acc.type === 'checking' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                  {acc.type === 'checking' ? <Banknote size={24} /> : <CreditCard size={24} />}
                </div>
                <button className="text-slate-300 hover:text-slate-600">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-slate-700 text-lg">{acc.name}</h3>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  {acc.type === 'checking' ? 'Conta Corrente' : 'Cartão de Crédito'}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-slate-400 text-xs mb-1">Saldo Atual</p>
                <p className="text-2xl font-bold text-slate-800">
                  €{acc.balance.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}