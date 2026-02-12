import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard'; // Importando a página real

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rotas que usam o Layout */}
        <Route element={<Layout />}>
          {/* Agora usamos o componente real no lugar do placeholder */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Aqui adicionaremos as outras rotas depois */}
          {/* <Route path="/accounts" element={<Accounts />} /> */}
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;