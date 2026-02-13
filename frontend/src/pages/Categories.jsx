import { useEffect, useState } from 'react';
import { Plus, Tag, Loader2 } from 'lucide-react';
import api from '../services/api';
import CategoryModal from '../components/CategoryModal';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data || []);
    } catch (err) {
      console.error("Erro ao carregar categorias", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getRuleBadge = (rule) => {
    const map = {
      "50": { label: "Essencial (50%)", color: "bg-blue-100 text-blue-700" },
      "30": { label: "Lazer (30%)", color: "bg-green-100 text-green-700" },
      "20": { label: "Metas (20%)", color: "bg-amber-100 text-amber-700" }
    };
    return map[rule] || { label: rule, color: "bg-slate-100 text-slate-600" };
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categorias</h1>
          <p className="text-slate-500 text-sm">Organize seus gastos na regra 50/30/20</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={20} />
          Nova Categoria
        </button>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Carregando categorias...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 text-lg">Nenhuma categoria encontrada.</p>
            <p className="text-slate-400 text-sm">Crie categorias para classificar seus gastos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nome</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Grupo da Regra</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Tag size={18} />
                      </div>
                      <span className="font-medium text-slate-700">{cat.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRuleBadge(cat.rule_group).color}`}>
                        {getRuleBadge(cat.rule_group).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <button className="text-sm font-medium hover:text-blue-600 transition-colors">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCategories} 
      />
    </div>
  );
}