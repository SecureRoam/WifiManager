import React, { useState, useEffect } from 'react';
import cockpit from 'cockpit';
import ActiveNetwork from './component/network/ActiveNetwork.jsx';
import NetworkTable from './component/network/NetworkTable.jsx';
import SearchBar from './component/network/SearchBar.jsx';
import channelToFrequency from './component/network/utils/channelToFrequency.jsx';
import SignalGraph from './component/network/SignalGraph.jsx';
import './component/network/SignalGraph.css';
import './app.scss';
const _ = cockpit.gettext;

export const Application = () => {
  const [hostname, setHostname] = useState(_('Unknown'));
  const [availableNetworks, setAvailableNetworks] = useState([]);
  const [activeNetwork, setActiveNetwork] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredNetworks, setFilteredNetworks] = useState([]);
  const [searchNetwork, setSearchNetwork] = useState([]);
  useEffect(() => {
    cockpit.file('/etc/hostname').watch(content => {
      setHostname(content.trim());
    });
    fetchNetworkInfo();
  }, []);

const handleSearch = (searchTerm) => {
    console.log(searchTerm);
    const filteredNetworks = availableNetworks.filter((network) => network.ssid.toLowerCase().includes(searchTerm.toLowerCase()) && network.inuse !== '*');
    setSearchNetwork(filteredNetworks);
}
const fetchNetworkInfo = async () => {
  setIsLoading(true);
  try {
    const availableDevicesOutput = cockpit.spawn(['nmcli', '-f', 'IN-USE,ssid,mode,chan,rate,signal,bars,security', '-t', 'dev', 'wifi'], {superuser: 'try'}).stream((data) => {
      console.log(data);
      const availableNetworks = [];
      data.split('\n').forEach((line) => {
        const [inuse, ssid, mode, chan, rate, signal, bars, security] = line.split(':');
        const frequency = channelToFrequency(chan);
        availableNetworks.push({inuse, ssid, mode, chan, rate, signal, bars, security, frequency});
      });
      const activeNetwork = availableNetworks.find((network) => network.inuse === '*');
      setActiveNetwork(activeNetwork);
      // Filter the availableNetworks array and store the filtered array in a separate state variable
      setFilteredNetworks(availableNetworks.filter((network) => network.inuse !== '*'));
    }).then(() => {
      console.log('done');
      setIsLoading(false);
    }).catch((error) => console.error(error));

  } catch (error) {
    console.error('Failed to fetch network info', error);
    setError(error);
    setIsLoading(false);
  }
};


const reloadNetworkInfo = () => {
    fetchNetworkInfo();
  };

  return (
      <div className="container">
        <div className="header">
          <button type="button" className="btn btn-primary reload-button" onClick={reloadNetworkInfo}>
            {_('Reload Network List')}
          </button>
        </div>
        {error && (
            <div className="alert alert-danger" role="alert">
              {_('Failed to fetch network info. Please check the console for details.')}
            </div>
        )}
        <div className="content">
          {activeNetwork && (
                <ActiveNetwork network={{inuse: true,  currentNetwork:activeNetwork}} />
          )}
          {!activeNetwork && (
                <ActiveNetwork network={{ inuse: false }} />
          )}
          {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
              </div>
          )}
          {!isLoading && (
              <>
                <SearchBar onSearch={handleSearch}/>
                <NetworkTable activeNetwork={activeNetwork} otherNetworks={ searchNetwork==[] ? searchNetwork : filteredNetworks} />
              </>
          )}
        </div>
      </div>
  );
};
