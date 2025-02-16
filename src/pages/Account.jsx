import { useState, useRef, useEffect } from 'react';
import { Typography, Input, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { EditOutlined } from '@ant-design/icons';
import { authService } from '../services';
import { useModal } from '../components/modals/ModalProvider';
import { logout } from '../features/auth/authSlice';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/Button';

const { Title, Text } = Typography;

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);
  const { openModalSuccess, openModalError } = useModal();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setProfileData(response.data);
        
        // Update form with fetched data
        form.setFieldsValue({
          email: response.data.email,
          firstName: response.data.first_name,
          lastName: response.data.last_name
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        openModalError({
          title: 'Gagal Memuat Profil',
          content: error.message
        });
      }
    };

    fetchProfile();
  }, [form]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (100kb = 100 * 1024 bytes)
    if (file.size > 100 * 1024) {
      openModalError({
        title: 'Ukuran File Terlalu Besar',
        content: 'Ukuran gambar maksimum 100kb'
      });
      return;
    }

    try {
      setLoading(true);
      await authService.updateImage({ file });
      
      // Fetch updated profile data
      const response = await authService.getProfile();
      setProfileData(response.data);
      
      openModalSuccess({
        title: 'Foto Profil Berhasil Diperbarui',
        content: 'Foto profil anda telah berhasil diperbarui'
      });
    } catch (error) {
      openModalError({
        title: 'Gagal Mengubah Foto Profil',
        content: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    form.setFieldsValue({
      email: profileData?.email,
      firstName: profileData?.first_name,
      lastName: profileData?.last_name
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.setFieldsValue({
      email: profileData?.email,
      firstName: profileData?.first_name,
      lastName: profileData?.last_name
    });
  };

  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await authService.updateProfile({
        firstName: values.firstName,
        lastName: values.lastName
      });

      // Fetch updated profile data
      const response = await authService.getProfile();
      setProfileData(response.data);
      
      openModalSuccess({
        title: 'Profil Berhasil Diperbarui',
        content: 'Data profil anda telah berhasil diperbarui'
      });

      setIsEditing(false);
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        return;
      }
      openModalError({
        title: 'Gagal Mengubah Profil',
        content: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getProfileImage = () => {
    const imageUrl = profileData?.profile_image || user?.profile_image;
    if (!imageUrl || imageUrl.includes('null')) {
      return '/assets/Profile Photo.png';
    }
    return imageUrl;
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div 
            style={{ 
              position: 'relative',
              width: '120px',
              height: '120px',
              margin: '0 auto 24px',
              cursor: 'pointer'
            }}
            onClick={handleImageClick}
          >
            <img
              src={getProfileImage()}
              alt="Profile"
              style={{ 
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              background: '#FFFFFF',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <EditOutlined style={{ color: '#666666' }} />
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <Title level={4} style={{ margin: 0 }}>
            {profileData?.first_name} {profileData?.last_name}
          </Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          disabled={!isEditing}
        >
          <Form.Item
            name="email"
            label="Email"
          >
            <Input disabled={true} />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="Nama Depan"
            rules={[
              { required: true, message: 'Nama depan wajib diisi' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Nama Belakang"
            rules={[
              { required: true, message: 'Nama belakang wajib diisi' }
            ]}
          >
            <Input />
          </Form.Item>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
            {!isEditing ? (
              <>
                <Button
                  variant="primary"
                  onClick={handleEditProfile}
                  loading={loading}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  loading={loading}
                >
                  Simpan
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Batalkan
                </Button>
              </>
            )}
          </div>
        </Form>
      </div>
    </MainLayout>
  );
};

export default Account; 