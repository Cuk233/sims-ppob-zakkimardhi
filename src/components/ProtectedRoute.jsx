import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../features/auth/authSlice';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!user) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute; 