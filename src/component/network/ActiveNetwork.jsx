import React from 'react';
import SignalGraph from './SignalGraph';
import './ActiveNetwork.css';
import './SignalGraph.css';
import cockpit from 'cockpit';
const _ = cockpit.gettext;
const ActiveNetwork = ({ network }) => {
  const signalStrength = network.currentNetwork ? Math.round((parseInt(network.currentNetwork.signal) + 100) / 7 * 100) / 100 : 0;

  return (
    <div className="active-network-wrapper"  style={network.inuse?{border: "solid 2px green"}: {border:"solid 2px red"}}>
      <div className="active-network-header">
        <h2>{network.currentNetwork ? network.currentNetwork.ssid : _('Not Connected')}</h2>
        {/*<div className="connection-status">
          {network.inuse && (
            <>
              <span className="status-indicator connected">Connected</span>
            </>
          )}
          {!network.inuse && (
            <>
              <span className="status-indicator disconnected">Not Connected</span>
            </>
          )}
        </div>*/}
      </div>
      <div className="active-network-details">
        <div className="detail-row">
          <div className="detail-label">Frequency:</div>
          <div className="detail-value">{network.currentNetwork ? `${network.currentNetwork.frequency}` : ''}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Signal:</div>
          <div className="detail-value signal-strength">
          <SignalGraph signal={network.currentNetwork ? network.currentNetwork.signal : 0} />
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Rate:</div>
          <div className="detail-value">{network.currentNetwork ? `${network.currentNetwork.rate}` : ''}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Security:</div>
          <div className="detail-value">{network.currentNetwork ? network.currentNetwork.security : ''}</div>
        </div>
        {/* Add more network details as needed */}
      </div>
    </div>
  );
};

export default ActiveNetwork;
