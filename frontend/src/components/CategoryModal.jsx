import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function CategoryModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rule_group: '50'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/categories', formData);
      onSuccess();
      onClose();
    } catch (err) {
      alert("Erro ao criar categoria.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Nova Categoria</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            required
            placeholder="Ex: Aluguel, Mercado..."
            className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <select 
            className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            onChange={e => setFormData({...formData, rule_group: e.target.value})}
          >
            <option value="50">Essencial (50%)</option>
            <option value="30">Lazer (30%)</option>
            <option value="20">Metas (20%)</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Categoria'}
          </button>
        </form>
      </div>
    </div>
  );
}