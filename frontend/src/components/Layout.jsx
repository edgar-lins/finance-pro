import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  Target, 
  LogOut, 
  User as UserIcon 
} from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/accounts', icon: Wallet, label: 'Contas' },
    { path: '/transactions', icon: ArrowLeftRight, label: 'Transações' },
    { path: '/goals', icon: Target, label: 'Metas' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-400">FinancePro</h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">
          <div className="flex items-center gap-3 text-slate-600">
            <span className="font-medium">{user.first_name} {user.last_name}</span>
            <div className="bg-slate-100 p-2 rounded-full">
              <UserIcon size={20} />
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet /> {/* Aqui é onde as páginas (Dashboard, etc) serão renderizadas */}
        </div>
      </main>
    </div>
  );
}