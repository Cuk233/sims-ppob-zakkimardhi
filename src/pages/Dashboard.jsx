import { useEffect, useState, useRef } from 'react';
import { Typography, Space, Carousel } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../features/auth/authSlice';
import { serviceService } from '../services';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isAuthenticated || initialFetchDone.current) return;

      try {
        if (!user) {
          await dispatch(getProfile()).unwrap();
        }

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
      {/* Profile and Balance Section */}
      <ProfileBalanceInfo />

      {/* Services Grid */}
      <div className="service-grid">
        {services.map((service) => (
          <div
            key={service.service_code}
            onClick={() => navigate(`/transaction/${service.service_code}`)}
            className="service-item"
            style={{ 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{
              width: isMobile ? '36px' : '48px',
              height: isMobile ? '36px' : '48px',
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
              fontSize: isMobile ? '11px' : '12px', 
              color: '#4D4D4D',
              textAlign: 'center',
              lineHeight: 1.2
            }}>
              {service.service_name}
            </Text>
          </div>
        ))}
      </div>

      {/* Promo Banner Carousel */}
      <div>
        <Text style={{ 
          fontSize: isMobile ? '14px' : '16px', 
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
              breakpoint: 1200,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
              }
            },
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
    </MainLayout>
  );
};

export default Dashboard; 