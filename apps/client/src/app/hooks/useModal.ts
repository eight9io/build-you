import { useState } from "react";

const useModal = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);

  return { isVisible, openModal, closeModal };
};

export default useModal;