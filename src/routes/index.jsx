import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import TopUp from '../pages/TopUp';
import Transaction from '../pages/Transaction';
import TransactionHistory from '../pages/TransactionHistory';
import Account from '../pages/Account';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/topup" element={<TopUp />} />
        <Route path="/transaction/:serviceCode" element={<Transaction />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/profile" element={<Account />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes; 