import { createContext, useContext } from 'react';
import { App, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearError } from '../../features/api/apiSlice';

const ModalContext = createContext({});

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

function ModalProvider({ children }) {
  const { modal } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { apiResponse } = useSelector((state) => state.api);

  const modalProps = {
    width: 420,
    centered: true,
    maskClosable: false,
    keyboard: false,
    title: null,
    icon: null,
    footer: null,
    closable: false,
    wrapClassName: 'custom-modal',
    afterClose: () => {
      dispatch(clearError());
    }
  };

  const getModalContent = (content) => {
    if (apiResponse?.message) {
      return apiResponse.message;
    }
    
    if (typeof content === 'string') {
      return content;
    }
    
    if (content?.message) {
      return content.message;
    }

    return 'Terjadi kesalahan';
  };

  const openModalError = ({ title, content, okText = 'Kembali ke Beranda', onAction }) => {
    const instance = modal.error({
      ...modalProps,
      content: (
        <div className="modal-content">
          <img src="/assets/Error.png" alt="Error" className="modal-icon" />
          <span className="modal-title">{title}</span>
          <div className="modal-description">{getModalContent(content)}</div>
          <a 
            href="#" 
            className="modal-action-link"
            onClick={(e) => {
              e.preventDefault();
              if (onAction) {
                onAction();
              }
              instance.destroy();
            }}
          >
            {okText}
          </a>
        </div>
      )
    });
  };

  const openModalSuccess = ({ title, content, okText = 'Kembali ke Beranda', onAction }) => {
    const instance = modal.success({
      ...modalProps,
      content: (
        <div className="modal-content">
          <img src="/assets/Success.png" alt="Success" className="modal-icon" />
          <span className="modal-title">{title}</span>
          <div className="modal-description">{getModalContent(content)}</div>
          <a 
            href="#" 
            className="modal-action-link"
            onClick={(e) => {
              e.preventDefault();
              if (onAction) {
                onAction();
              }
              instance.destroy();
            }}
          >
            {okText}
          </a>
        </div>
      )
    });
  };

  const openModalWarning = ({ title, content, okText = 'Kembali ke Beranda', onAction }) => {
    const instance = modal.warning({
      ...modalProps,
      content: (
        <div className="modal-content">
          <img src="/assets/Warning.png" alt="Warning" className="modal-icon" />
          <span className="modal-title">{title}</span>
          <div className="modal-description">{getModalContent(content)}</div>
          <a 
            href="#" 
            className="modal-action-link"
            onClick={(e) => {
              e.preventDefault();
              if (onAction) {
                onAction();
              }
              instance.destroy();
            }}
          >
            {okText}
          </a>
        </div>
      )
    });
  };

  const openModalConfirm = ({ 
    title, 
    content, 
    okText = 'Iya, Saya Yakin', 
    cancelText = 'Batal',
    onAction,
    onCancel 
  }) => {
    const instance = modal.confirm({
      ...modalProps,
      content: (
        <div className="modal-content">
          <img src="/assets/Warning.png" alt="Confirm" className="modal-icon" />
          <span className="modal-title">{title}</span>
          <div className="modal-description">{getModalContent(content)}</div>
          <div className="modal-actions">
            <a 
              href="#" 
              className="modal-action-link modal-action-primary"
              onClick={(e) => {
                e.preventDefault();
                if (onAction) {
                  onAction();
                }
                instance.destroy();
              }}
            >
              {okText}
            </a>
            <a 
              href="#" 
              className="modal-action-link modal-action-secondary"
              onClick={(e) => {
                e.preventDefault();
                if (onCancel) {
                  onCancel();
                }
                instance.destroy();
              }}
            >
              {cancelText}
            </a>
          </div>
        </div>
      )
    });
  };

  return (
    <ModalContext.Provider
      value={{
        openModalError,
        openModalSuccess,
        openModalWarning,
        openModalConfirm
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default ModalProvider; 