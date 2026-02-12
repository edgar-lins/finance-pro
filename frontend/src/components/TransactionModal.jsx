import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function TransactionModal({ isOpen, onClose, onSuccess }) {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    account_id: '',
    category_id: '',
    is_credit_card: false,
    total_installments: 1
  });

  useEffect(() => {
    if (isOpen) {
      // Carregar dados necessários para os selects
      Promise.all([
        api.get('/accounts'),
        api.get('/categories')
      ]).then(([accRes, catRes]) => {
        setAccounts(accRes.data || []);
        setCategories(catRes.data || []);
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
        total_installments: parseInt(formData.total_installments)
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert("Erro ao salvar transação");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Nova Transação</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Descrição"
            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="0.01"
              placeholder="Valor"
              className="w-full p-2 border rounded-lg"
              required
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
            <input
              type="date"
              className="w-full p-2 border rounded-lg"
              value={formData.date}
              required
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <select 
            className="w-full p-2 border rounded-lg"
            required
            onChange={e => setFormData({...formData, account_id: e.target.value})}
          >
            <option value="">Selecionar Conta</option>
            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
          </select>

          <select 
            className="w-full p-2 border rounded-lg"
            required
            onChange={e => setFormData({...formData, category_id: e.target.value})}
          >
            <option value="">Selecionar Categoria</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name} ({cat.rule_group}%)</option>)}
          </select>

          <div className="flex items-center gap-4 p-2 bg-slate-50 rounded-lg">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                onChange={e => setFormData({...formData, is_credit_card: e.target.checked})}
              />
              Cartão de Crédito?
            </label>
            
            {formData.is_credit_card && (
              <input 
                type="number" 
                placeholder="Parcelas"
                className="w-20 p-1 border rounded"
                min="1"
                onChange={e => setFormData({...formData, total_installments: e.target.value})}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Salvar Transação'}
          </button>
        </form>
      </div>
    </div>
  );
}