import { useState, useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { serviceService, transactionService } from '../services';
import { useModal } from '../components/modals/ModalProvider';
import MainLayout from '../components/layout/MainLayout';
import ProfileBalanceInfo from '../components/ProfileBalanceInfo';
import Button from '../components/Button';

const { Title, Text } = Typography;

const Transaction = () => {
  const navigate = useNavigate();
  const { serviceCode } = useParams();
  const [service, setService] = useState(null);
  const { openModalSuccess, openModalError } = useModal();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await serviceService.getServices();
        const selectedService = response.data.find(s => s.service_code === serviceCode);
        if (selectedService) {
          setService(selectedService);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        navigate('/');
      }
    };

    fetchService();
  }, [serviceCode, navigate]);

  const handlePayment = async () => {
    try {
      await transactionService.payment(serviceCode);
      
      openModalSuccess({
        title: 'Pembayaran Berhasil',
        content: `Pembayaran ${service?.service_name} sebesar Rp${service?.service_tariff.toLocaleString('id-ID')} berhasil`,
        okText: 'Kembali ke Beranda',
        onAction: () => navigate('/')
      });
    } catch (error) {
      openModalError({
        title: 'Pembayaran Gagal',
        content: error.message || 'Terjadi kesalahan saat melakukan pembayaran',
      });
    }
  };

  if (!service) {
    return null;
  }

  return (
    <MainLayout>
      {/* Profile and Balance Section */}
      <ProfileBalanceInfo />

      {/* Payment Section */}
      <Row>
        <Col xs={24} md={16} lg={12} style={{ 
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '14px' : '16px',
              color: '#4D4D4D',
              marginBottom: '8px'
            }}>
              Pembayaran
            </Text>
            <Title level={2} style={{ 
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 700,
              marginTop: 0,
              marginBottom: '32px',
              color: '#1A1A1A'
            }}>
              {service.service_name}
            </Title>

            <div style={{ 
              width: '100%', 
              marginBottom: '32px',
              padding: isMobile ? '20px' : '24px',
              background: '#FFFFFF',
              border: '1px solid #D0D0D0',
              borderRadius: '8px'
            }}>
              <Text style={{ 
                fontSize: isMobile ? '14px' : '16px',
                color: '#4D4D4D',
                display: 'block',
                marginBottom: '8px'
              }}>
                Total Bayar
              </Text>
              <Text style={{ 
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 700,
                color: '#1A1A1A'
              }}>
                Rp{service.service_tariff.toLocaleString('id-ID')}
              </Text>
            </div>

            <Button
              variant="primary"
              onClick={handlePayment}
              fullWidth={isMobile}
              style={{
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Bayar
            </Button>
          </div>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Transaction; 