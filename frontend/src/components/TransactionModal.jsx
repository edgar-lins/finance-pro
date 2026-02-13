import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

export default function TransactionModal({ isOpen, onClose, onSuccess }) {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    description: '', amount: 0, date: new Date().toISOString().split('T')[0],
    account_id: '', category_id: '', type: 'expense', is_credit_card: false
  });

  // Adicione isso dentro do seu useEffect ou no onSuccess
    useEffect(() => {
        if (isOpen) {
            // Resetar o form ao abrir para evitar lixo de dados anteriores
            setFormData({
            description: '', amount: 0, date: new Date().toISOString().split('T')[0],
            account_id: '', category_id: '', type: 'expense', is_credit_card: false
            });
            api.get('/accounts').then(res => setAccounts(res.data || []));
            api.get('/categories').then(res => setCategories(res.data || []));
        }
    }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', { ...formData, amount: parseFloat(formData.amount) });
      onSuccess();
      onClose();
    } catch (err) { alert("Erro ao salvar transação"); }
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
          <input required placeholder="Descrição" className="w-full p-2 border rounded-lg"
            onChange={e => setFormData({...formData, description: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <input type="number" step="0.01" placeholder="Valor" className="w-full p-2 border rounded-lg"
              onChange={e => setFormData({...formData, amount: e.target.value})} />
            <input type="date" className="w-full p-2 border rounded-lg" value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>

          <select required className="w-full p-2 border rounded-lg" 
            onChange={e => setFormData({...formData, account_id: e.target.value})}>
            <option value="">Selecionar Conta</option>
            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
          </select>

          <select required className="w-full p-2 border rounded-lg"
            onChange={e => setFormData({...formData, category_id: e.target.value})}>
            <option value="">Selecionar Categoria</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" onChange={e => setFormData({...formData, is_credit_card: e.target.checked})} />
            Cartão de Crédito?
          </label>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">
            Salvar Transação
          </button>
        </form>
      </div>
    </div>
  );
}