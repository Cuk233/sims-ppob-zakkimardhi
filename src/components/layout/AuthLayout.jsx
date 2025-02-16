import { Row, Col, Typography, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthIllustration from './AuthIllustration';

const { Title } = Typography;

const AuthLayout = ({ children, title, illustration }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Only redirect if we're on auth pages
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    navigate('/');
    return null;
  }

  return (
    <Row className="auth-container">
      <Col xs={24} lg={12} className="auth-form-container">
        <div className="auth-form">
          <Space direction="vertical" align="center" style={{ width: '100%', marginBottom: 48 }}>
            <Space align="center" style={{ marginBottom: 16 }}>
              <img
                src="/assets/Logo.png"
                alt="SIMS PPOB"
                style={{ height: 24 }}
              />
              <Title level={5} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                SIMS PPOB
              </Title>
            </Space>
            {title && (
              <Title level={3} style={{ margin: 0, fontSize: 24, fontWeight: 600, textAlign: 'center' }}>
                {title}
              </Title>
            )}
          </Space>
          {children}
        </div>
      </Col>

      <AuthIllustration image={illustration} />
    </Row>
  );
};

export default AuthLayout; 