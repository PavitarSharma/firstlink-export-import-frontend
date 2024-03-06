import React, { useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  body: React.ReactNode;
  width?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, body, width="md" }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);

    onClose();
  }, [onClose]);


  
  return (
    <div className="fixed inset-0 bg-black/30 z-[1000] p-4 flex items-center justify-center h-screen">
      <div className={`w-full max-w-${width} transform overflow-hidden rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all relative`}>
        <button onClick={handleClose} className="absolute top-4 right-4">
        <IoClose />

        </button>
        {body}
      </div>
    </div>
  );
};

export default Modal;
