import React from 'react';
import Modal from 'react-modal';
import './Modal.css';

const ModalComponent = ({ isOpen, closeModal, children }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            className="Modal"
            overlayClassName="ModalOverlay"
            appElement={document.getElementById('app')}
        >
            {children}
        </Modal>
    );
};

export default ModalComponent;