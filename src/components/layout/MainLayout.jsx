import { Layout, Menu, Space, Typography } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const { Header, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { key: 'topup', label: 'Top Up', path: '/topup' },
    { key: 'transaction', label: 'Transaction', path: '/transaction-history' },
    { key: 'akun', label: 'Akun', path: '/profile' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#FFF' }}>
      <Header style={{ 
        background: '#FFF', 
        borderBottom: '1px solid #E5E5E5',
        padding: '0 24px',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto', 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo and Brand */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Space align="center">
              <img src="/assets/Logo.png" alt="SIMS PPOB" style={{ height: '24px' }} />
              <Title level={5} style={{ 
                margin: 0, 
                fontSize: '16px', 
                fontWeight: 600,
                color: '#1A1A1A'
              }}>
                SIMS PPOB
              </Title>
            </Space>
          </Link>

          {/* Navigation Menu */}
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            style={{ 
              border: 'none',
              flex: 1,
              justifyContent: 'flex-end',
              background: 'transparent'
            }}
          >
            {menuItems.map((item) => (
              <Menu.Item 
                key={item.path}
                style={{
                  fontSize: '14px',
                  color: '#4D4D4D',
                  margin: '0 16px',
                  padding: '0 8px'
                }}
              >
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </Header>

      <Content>
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout; 