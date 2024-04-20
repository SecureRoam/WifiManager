import React, { useState } from 'react';
import './NetworkTable.css';
import SignalGraph from './SignalGraph';
import './SignalGraph.jsx';

function NetworkTable({ activeNetwork, otherNetworks, isLoading }) {
  const headers = ['SSID', 'FREQUENCY', 'RATE', 'SIGNAL', 'SECURITY'];

  return (
    <div className="table-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
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
            <tr key={network.ssid}>
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
