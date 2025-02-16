import { useState, useEffect } from 'react';
import { Row, Col, Typography, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { balanceService } from '../services';
import { useModal } from '../components/modals/ModalProvider';
import MainLayout from '../components/layout/MainLayout';
import ProfileBalanceInfo from '../components/ProfileBalanceInfo';
import Button from '../components/Button';

const { Title, Text } = Typography;

const TopUp = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const { openModalSuccess, openModalError } = useModal();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const quickAmounts = [
    { label: 'Rp10.000', value: 10000 },
    { label: 'Rp20.000', value: 20000 },
    { label: 'Rp50.000', value: 50000 },
    { label: 'Rp100.000', value: 100000 },
    { label: 'Rp250.000', value: 250000 },
    { label: 'Rp500.000', value: 500000 },
  ];

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 1000000)) {
      setAmount(value);
    }
  };

  const handleQuickAmountClick = (value) => {
    setAmount(value.toString());
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const handleTopUp = async () => {
    try {
      const amountValue = parseInt(amount);
      if (amountValue < 10000 || amountValue > 1000000) {
        openModalError({
          title: 'Top Up Gagal',
          content: 'Nominal top up harus antara Rp10.000 - Rp1.000.000',
        });
        return;
      }

      await balanceService.topUp(amountValue);
      
      openModalSuccess({
        title: 'Top Up Berhasil',
        content: `Top up sebesar Rp${formatAmount(amountValue)} berhasil`,
        okText: 'Kembali ke Beranda',
        onAction: () => navigate('/')
      });
    } catch (error) {
      openModalError({
        title: 'Top Up Gagal',
        content: error.message || 'Terjadi kesalahan saat melakukan top up',
      });
    }
  };

  const isValidAmount = amount && parseInt(amount) >= 10000 && parseInt(amount) <= 1000000;

  return (
    <MainLayout>
      {/* Profile and Balance Section */}
      <ProfileBalanceInfo />

      {/* Top Up Section */}
      <Row gutter={[24, 24]}>
        {/* Left Column - Input Form */}
        <Col xs={24} md={12}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left',
            marginBottom: isMobile ? '24px' : 0
          }}>
            <Text style={{ 
              fontSize: isMobile ? '14px' : '16px',
              color: '#4D4D4D',
              marginBottom: '8px'
            }}>
              Silahkan masukan
            </Text>
            <Title level={2} style={{ 
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 700,
              marginTop: 0,
              marginBottom: '32px',
              color: '#1A1A1A'
            }}>
              Nominal Top Up
            </Title>

            <Input
              placeholder="masukan nominal Top Up"
              value={amount ? `Rp${formatAmount(amount)}` : ''}
              onChange={handleAmountChange}
              style={{ 
                height: isMobile ? '40px' : '48px',
                marginBottom: '24px',
                fontSize: isMobile ? '14px' : '16px',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #D0D0D0'
              }}
            />

            <Button
              variant="primary"
              onClick={handleTopUp}
              disabled={!isValidAmount}
              fullWidth={isMobile}
              style={{ 
                alignSelf: isMobile ? 'stretch' : 'flex-start',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Top Up
            </Button>
          </div>
        </Col>

        {/* Right Column - Quick Amounts */}
        <Col xs={24} md={12}>
          <div style={{ 
            marginTop: isMobile ? 0 : '100px',
            paddingLeft: isMobile ? 0 : '24px'
          }}>
            <Row gutter={[16, 16]}>
              {quickAmounts.map((quickAmount) => (
                <Col key={quickAmount.value} xs={12} sm={8}>
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAmountClick(quickAmount.value)}
                    fullWidth
                  >
                    {quickAmount.label}
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default TopUp; 