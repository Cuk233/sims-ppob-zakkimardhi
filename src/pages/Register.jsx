import { Form, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '../components/form/TextInput';
import PasswordInput from '../components/form/PasswordInput';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import AuthLayout from '../components/layout/AuthLayout';
import { register, clearError } from '../features/auth/authSlice';
import Button from '../components/Button';
import { useEffect } from 'react';
import { useModal } from '../components/modals/ModalProvider';

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { openModalError, openModalSuccess, openModalWarning } = useModal();
  
  // Get auth and api states
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
        case 102:
          openModalWarning({
            title: 'Email Sudah Terdaftar',
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
    if (values.password !== values.confirmPassword) {
      openModalWarning({
        title: 'Password Tidak Sama',
        content: 'Password dan konfirmasi password harus sama',
      });
      return;
    }

    try {
      await dispatch(register(values)).unwrap();
      openModalSuccess({
        title: 'Registrasi Berhasil',
        content: 'Silakan login dengan akun yang telah dibuat',
        okText: 'Login Sekarang',
        onAction: () => navigate('/login')
      });
    } catch (err) {
      // Error is handled by the error useEffect
    }
  };

  return (
    <AuthLayout
      title="Lengkapi data untuk membuat akun"
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

        <TextInput
          name="firstName"
          placeholder="nama depan"
          prefix={<UserOutlined style={{ color: '#838383' }} />}
          rules={[
            { required: true, message: 'Nama depan wajib diisi' }
          ]}
        />

        <TextInput
          name="lastName"
          placeholder="nama belakang"
          prefix={<UserOutlined style={{ color: '#838383' }} />}
          rules={[
            { required: true, message: 'Nama belakang wajib diisi' }
          ]}
        />

        <PasswordInput
          name="password"
          placeholder="buat password"
          rules={[
            { required: true, message: 'Password wajib diisi' },
            { min: 8, message: 'Password minimal 8 karakter' }
          ]}
        />

        <PasswordInput
          name="confirmPassword"
          placeholder="konfirmasi password"
          rules={[
            { required: true, message: 'Konfirmasi password wajib diisi' }
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
          Registrasi
        </Button>

        <div style={{ textAlign: 'center', marginTop: '35px' }}>
          <span style={{ fontSize: 14, color: '#4D4D4D' }}>
            sudah punya akun? login {' '}
            <Link to="/login" style={{ color: 'var(--primary-color)' }}>di sini</Link>
          </span>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Register; 