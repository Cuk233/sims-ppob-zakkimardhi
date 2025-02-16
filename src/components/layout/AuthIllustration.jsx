import { Col } from 'antd';

const AuthIllustration = ({ image }) => {
  return (
    <Col xs={0} lg={12} className="auth-illustration">
      <img
        src={image}
        alt="Illustration"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Col>
  );
};

export default AuthIllustration; 