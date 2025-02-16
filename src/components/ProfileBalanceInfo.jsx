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
    <Row gutter={24} style={{ marginBottom: '32px' }}>
      {/* Profile Section */}
      <Col flex="360px">
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <img
            src={getProfileImage()}
            alt="Profile"
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%',
              marginBottom: '16px'
            }}
          />
          <Text style={{ 
            color: '#4D4D4D', 
            fontSize: '24px',
            marginBottom: '4px'
          }}>
            Selamat datang,
          </Text>
          <Text style={{ 
            fontSize: '36px', 
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
          padding: '24px',
          height: '80%',
          minHeight: '100px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            color: '#FFFFFF', 
            fontSize: '14px', 
            marginBottom: '8px',
            opacity: 0.9
          }}>
            Saldo anda
          </div>
          <div style={{ 
            color: '#FFFFFF', 
            fontSize: '32px', 
            fontWeight: 600, 
            marginBottom: '12px'
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
              fontSize: '14px',
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