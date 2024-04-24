import React, { useState } from 'react';
import './NetworkTable.css';
import SignalGraph from './SignalGraph';
import './SignalGraph.jsx';
import Modal from "../modal/Modal.jsx";

function NetworkTable({ activeNetwork, otherNetworks, isLoading, onConnect }) {
  const headers = ['SSID', 'FREQUENCY', 'RATE', 'SIGNAL', 'SECURITY'];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedNetwork, setClickedNetwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleClick = (event) => {
    const clickedNetwork = event.target.parentNode.innerText.split('\t')[0];
    setClickedNetwork(clickedNetwork);
    openModal();
    // open modal with clicked network
  };
  const handleConnect = () => {
    setLoading(true);
    onConnect(clickedNetwork, document.getElementById("password").value, closeModal);
  }
  const id=() => (Math.floor(Math.random() * 100) * Date.now()* Math.floor(Math.random() * 100)).toString(36);
  return (
    <div className="table-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      {isModalOpen && (
          <Modal isOpen={isModalOpen} closeModal={closeModal}>
            <h3>{clickedNetwork}</h3>
            <div className={"modal-content"}>
              <label htmlFor="password">Password : </label>
              <input id={"password"} type="password" />
              <br />
            </div>
            <button onClick={handleConnect}>Connect</button>
            {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
            )}
          </Modal>
      )}
      <table className="network-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render the other networks */}
          {otherNetworks.map((network) => (
            <tr key={network.ssid+"_"+id()} onClick={handleClick}>
              <td>{network.ssid}</td>
              <td>{network.frequency}</td>
              <td>{network.rate}</td>
              <td>
                <SignalGraph signal={network.signal} />
              </td>
              <td>{network.security}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NetworkTable;
