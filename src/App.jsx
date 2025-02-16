import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import 'antd/dist/reset.css';
import 'react-toastify/dist/ReactToastify.css';
import store from './features/store';
import { ModalProvider } from './components/modals';
import AppRoutes from './routes';

const themeConfig = {
  token: {
    colorPrimary: '#F42619',
    colorLink: '#F42619',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    Modal: {
      contentBg: '#ffffff',
      borderRadiusLG: 12,
      paddingContentHorizontalLG: 24,
      paddingMD: 0,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      titleFontSize: 20,
      titleLineHeight: 1.4,
      fontSize: 16,
      fontSizeLG: 16,
      headerBg: 'transparent',
      headerPadding: '32px 24px 8px',
      confirmBodyPadding: '32px 24px 8px',
      confirmIconSize: 80,
    },
    Button: {
      controlHeight: 48,
      controlHeightLG: 48,
      fontSize: 16,
      fontSizeLG: 16,
      borderRadius: 8,
      borderRadiusLG: 8,
      paddingInline: 16,
      paddingContentHorizontal: 16,
    }
  }
};

const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider theme={themeConfig}>
        <Router>
          <AntApp>
            <ModalProvider>
              <AppRoutes />
            </ModalProvider>
          </AntApp>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ConfigProvider>
    </Provider>
  );
};

export default App;
