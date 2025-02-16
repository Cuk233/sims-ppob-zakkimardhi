import { useEffect, useState, useRef } from 'react';
import { Row, Col, Typography, Space, Carousel } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../features/auth/authSlice';
import { serviceService, balanceService } from '../services';
import MainLayout from '../components/layout/MainLayout';
import ProfileBalanceInfo from '../components/ProfileBalanceInfo';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [services, setServices] = useState([]);
  const [banners, setBanners] = useState([]);
  const initialFetchDone = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isAuthenticated || initialFetchDone.current) return;

      try {
        // Only fetch profile if we don't have user data
        if (!user) {
          await dispatch(getProfile()).unwrap();
        }

        // Fetch other data only if component is still mounted
        if (isMounted) {
          const [servicesResponse, bannersResponse] = await Promise.all([
            serviceService.getServices(),
            serviceService.getBanners()
          ]);

          if (isMounted) {
            setServices(servicesResponse.data);
            setBanners(bannersResponse.data);
            initialFetchDone.current = true;
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const serviceIcons = {
    'Pajak PBB': '/assets/PBB.png',
    'Listrik': '/assets/Listrik.png',
    'PDAM Berlangganan': '/assets/PDAM.png',
    'Pulsa': '/assets/Pulsa.png',
    'PGN Berlangganan': '/assets/PGN.png',
    'Musik Berlangganan': '/assets/Musik.png',
    'TV Berlangganan': '/assets/Televisi.png',
    'Paket Data': '/assets/Paket Data.png',
    'Voucher Game': '/assets/Game.png',
    'Voucher Makanan': '/assets/Voucher Makanan.png',
    'Qurban': '/assets/Kurban.png',
    'Zakat': '/assets/Zakat.png'
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        {/* Profile and Balance Section */}
        <ProfileBalanceInfo />

        {/* Services Grid */}
        <div style={{ marginBottom: '40px' }}>
          <Row gutter={[24, 24]}>
            {services.map((service) => (
              <Col key={service.service_code} xs={8} sm={6} md={4} lg={3}>
                <div 
                  onClick={() => navigate(`/transaction/${service.service_code}`)}
                  style={{ 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    ':hover': { transform: 'scale(1.05)' }
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={serviceIcons[service.service_name]}
                      alt={service.service_name}
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                  <Text style={{ 
                    fontSize: '12px', 
                    color: '#4D4D4D',
                    display: 'block',
                    lineHeight: '1.2'
                  }}>
                    {service.service_name}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Promo Banner Carousel */}
        <div>
          <Text style={{ 
            fontSize: '16px', 
            fontWeight: 500, 
            color: '#1A1A1A',
            display: 'block',
            marginBottom: '16px'
          }}>
            Temukan promo menarik
          </Text>
          <Carousel 
            autoplay
            slidesToShow={3}
            slidesToScroll={1}
            dots={false}
            infinite={true}
            speed={500}
            cssEase="linear"
            arrows={true}
            responsive={[
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }
              }
            ]}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="banner-slide">
                <img
                  src={`/assets/Banner ${num}.png`}
                  alt={`Banner ${num}`}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard; 