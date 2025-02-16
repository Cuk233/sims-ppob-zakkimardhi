import { Layout, Menu, Space, Typography, Drawer, Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MenuOutlined } from '@ant-design/icons';
import { logout } from '../../features/auth/authSlice';
import { useState, useEffect } from 'react';

const { Header, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { key: 'topup', label: 'Top Up', path: '/topup' },
    { key: 'transaction', label: 'Transaction', path: '/transaction-history' },
    { key: 'akun', label: 'Akun', path: '/profile' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const renderMenu = () => (
    <Menu
      mode={isMobile ? "vertical" : "horizontal"}
      selectedKeys={[location.pathname]}
      style={{ 
        border: 'none',
        flex: isMobile ? 'none' : 1,
        justifyContent: isMobile ? 'flex-start' : 'flex-end',
        background: 'transparent',
        width: isMobile ? '100%' : 'auto'
      }}
    >
      {menuItems.map((item) => (
        <Menu.Item 
          key={item.path}
          onClick={() => handleMenuClick(item.path)}
          style={{
            fontSize: '14px',
            color: '#4D4D4D',
            margin: isMobile ? '8px 0' : '0 16px',
            padding: isMobile ? '12px 16px' : '0 8px',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: '#FFF' }}>
      <Header style={{ 
        background: '#FFF', 
        borderBottom: '1px solid #E5E5E5',
        padding: '0',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div className="container" style={{ 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 16px' : '0 24px',
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

          {/* Desktop Menu */}
          {!isMobile && renderMenu()}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              icon={<MenuOutlined />}
              type="text"
              onClick={() => setMobileMenuOpen(true)}
              style={{ border: 'none', padding: '8px' }}
            />
          )}
        </div>
      </Header>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        {renderMenu()}
      </Drawer>

      <Content>
        <div className="container" style={{ 
          padding: isMobile ? '16px' : '24px',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default MainLayout; 