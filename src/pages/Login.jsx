import { Form, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '../components/form/TextInput';
import PasswordInput from '../components/form/PasswordInput';
import { MailOutlined } from '@ant-design/icons';
import AuthLayout from '../components/layout/AuthLayout';
import { login, clearError } from '../features/auth/authSlice';
import Button from '../components/Button';
import { useEffect } from 'react';
import { useModal } from '../components/modals/ModalProvider';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { openModalError, openModalSuccess, openModalWarning } = useModal();
  
  const { error: authError, isAuthenticated } = useSelector((state) => state.auth);
  const { globalLoading } = useSelector((state) => state.api);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      const { status, message } = authError;
      
      switch (status) {
        case 103:
          openModalWarning({
            title: 'Login Gagal',
            content: message,
          });
          break;
        case 400:
          openModalError({
            title: 'Data Tidak Valid',
            content: message,
          });
          break;
        case 401:
          openModalError({
            title: 'Tidak Diizinkan',
            content: message,
          });
          break;
        default:
          openModalError({
            title: 'Terjadi Kesalahan',
            content: message,
          });
      }
      dispatch(clearError());
    }
  }, [authError, dispatch, openModalError, openModalWarning]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(login(values)).unwrap();
      // Redirect will happen automatically through the useEffect that watches isAuthenticated
    } catch (err) {
      // Error is handled by the error useEffect
    }
  };

  return (
    <AuthLayout
      title="Masuk atau buat akun untuk memulai"
      illustration="/assets/Illustrasi Login.png"
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark={false}
        className="w-full max-w-[480px] mx-auto px-8"
      >
        <TextInput
          name="email"
          placeholder="masukan email anda"
          prefix={<MailOutlined style={{ color: '#838383' }} />}
          rules={[
            { required: true, message: 'Email wajib diisi' },
            { type: 'email', message: 'Email tidak valid' }
          ]}
        />

        <PasswordInput
          name="password"
          placeholder="masukan password anda"
          rules={[
            { required: true, message: 'Password wajib diisi' }
          ]}
        />

        <Button
          variant="primary"
          htmlType="submit"
          size="large"
          fullWidth
          loading={globalLoading}
          className="mt-8"
        >
          Login
        </Button>

        <div style={{ textAlign: 'center', marginTop: '35px' }}>
          <span style={{ fontSize: 14, color: '#4D4D4D' }}>
            belum punya akun? registrasi {' '}
            <Link to="/register" style={{ color: 'var(--primary-color)' }}>di sini</Link>
          </span>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Login; 