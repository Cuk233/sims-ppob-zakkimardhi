import { useState, useCallback } from "react";

const useModal = (initialState = false) => {
  const [isVisible, setIsVisible] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  const showModal = useCallback((data = null) => {
    setModalData(data);
    setIsVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsVisible(false);
    setModalData(null);
  }, []);

  return {
    isVisible,
    modalData,
    showModal,
    hideModal,
  };
};

export default useModal;
