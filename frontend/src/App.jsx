import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';

// Componente simples para testar o Dashboard
const DashboardPlaceholder = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <p className="text-slate-600">Bem-vindo ao seu resumo financeiro!</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rotas que usam o Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
          {/* Adicionaremos Accounts, Transactions, etc, aqui em breve */}
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;