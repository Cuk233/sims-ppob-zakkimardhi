import { useEffect, useState } from 'react';
import { Row, Col, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { balanceService } from '../services';

const { Text } = Typography;

const ProfileBalanceInfo = () => {
  const { user } = useSelector((state) => state.auth);
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await balanceService.getBalance();
        setBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, []);

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const getProfileImage = () => {
    if (!user?.profile_image || user.profile_image.includes('null')) {
      return '/assets/Profile Photo.png';
    }
    return user.profile_image;
  };

  return (
    <Row 
      gutter={[16, 16]} 
      style={{ 
        marginBottom: isMobile ? '24px' : '32px',
        flexDirection: isMobile ? 'column' : 'row'
      }}
    >
      {/* Profile Section */}
      <Col 
        xs={24} 
        md={12} 
        style={{
          maxWidth: isMobile ? '100%' : '360px'
        }}
      >
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <img
            src={getProfileImage()}
            alt="Profile"
            style={{ 
              width: isMobile ? '48px' : '64px', 
              height: isMobile ? '48px' : '64px', 
              borderRadius: '50%',
              marginBottom: '16px'
            }}
          />
          <Text style={{ 
            color: '#4D4D4D', 
            fontSize: isMobile ? '20px' : '24px',
            marginBottom: '4px'
          }}>
            Selamat datang,
          </Text>
          <Text style={{ 
            fontSize: isMobile ? '28px' : '36px', 
            fontWeight: 700, 
            color: '#1A1A1A',
            lineHeight: 1.2
          }}>
            {user?.first_name} {user?.last_name}
          </Text>
        </div>
      </Col>

      {/* Balance Card */}
      <Col flex="auto">
        <div className="balance-card" style={{
          borderRadius: '16px',
          padding: isMobile ? '20px' : '24px',
          height: isMobile ? 'auto' : '80%',
          minHeight: '100px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            color: '#FFFFFF', 
            fontSize: isMobile ? '12px' : '14px', 
            marginBottom: '8px',
            opacity: 0.9
          }}>
            Saldo anda
          </div>
          <div style={{ 
            color: '#FFFFFF', 
            fontSize: isMobile ? '24px' : '32px', 
            fontWeight: 600, 
            marginBottom: '12px',
            wordBreak: 'break-word'
          }}>
            Rp {showBalance ? formatBalance(balance) : '•••••••'}
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            style={{ 
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: 0,
              fontSize: isMobile ? '12px' : '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {showBalance ? 'Tutup Saldo' : 'Lihat Saldo'} <EyeOutlined />
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default ProfileBalanceInfo; 