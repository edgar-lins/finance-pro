import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function AccountModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    balance: 0,
    credit_limit: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/accounts', {
        ...formData,
        balance: parseFloat(formData.balance),
        credit_limit: parseFloat(formData.credit_limit)
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert("Erro ao criar conta. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Nova Conta</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Conta</label>
            <input
              required
              placeholder="Ex: Nubank, Carteira..."
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <select 
              className="w-full p-2 border rounded-lg outline-none"
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="checking">Conta Corrente / Débito</option>
              <option value="credit">Cartão de Crédito</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Saldo Inicial</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border rounded-lg"
                onChange={e => setFormData({...formData, balance: e.target.value})}
              />
            </div>
            {formData.type === 'credit' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Limite</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded-lg"
                  onChange={e => setFormData({...formData, credit_limit: e.target.value})}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
}