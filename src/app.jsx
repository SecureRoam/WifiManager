import React, {useEffect, useState} from 'react';
import cockpit from 'cockpit';
import ActiveNetwork from './component/network/ActiveNetwork.jsx';
import NetworkTable from './component/network/NetworkTable.jsx';
import SearchBar from './component/network/SearchBar.jsx';
import channelToFrequency from './component/network/utils/channelToFrequency.jsx';
import './component/network/SignalGraph.css';
import './app.scss';

const _ = cockpit.gettext;

export const Application = () => {
    const [availableNetworks, setAvailableNetworks] = useState([]);
    const [activeNetwork, setActiveNetwork] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredNetworks, setFilteredNetworks] = useState([]);
    const [searchNetwork, setSearchNetwork] = useState([]);
    const [playOnce, setPlayOnce] = useState(true);
    const [retry, setRetry] = useState(0);
    useEffect(() => {
        if (playOnce) {
            fetchNetworkInfo();
            setPlayOnce(false);
        }
    }, [playOnce]);

    const handleSearch = (searchTerm) => {
        console.log(searchTerm);
        const filteredNetworks = availableNetworks.filter((network) => network.ssid.toLowerCase().includes(searchTerm.toLowerCase()) && network.inuse !== '*');
        setSearchNetwork(filteredNetworks);
    }
    const fetchNetworkInfo = async () => {
        setIsLoading(true);
        let resData;
        console.log('fetching network info');
        try {
            const availableDevicesOutput = cockpit.spawn(['nmcli', '-f', 'IN-USE,ssid,mode,chan,rate,signal,bars,security', '-t', 'dev', 'wifi'], {superuser: 'try'}).stream((data) => {
                resData= data;
            }).then(() => {
                const availableNetworks = [];
                resData.split('\n').forEach((line) => {
                    const [inuse, ssid, mode, chan, rate, signal, bars, security] = line.split(':');
                    const frequency = channelToFrequency(chan);
                    availableNetworks.push({inuse, ssid, mode, chan, rate, signal, bars, security, frequency});
                });
                const activeNetworks = availableNetworks.find((network) => network.inuse === '*');
                console.log(activeNetworks, activeNetworks != undefined);
                if(activeNetworks == undefined) {
                    setActiveNetwork(null);
                    setRetry(retry + 1);
                } else {
                    setActiveNetwork(activeNetworks);
                }
                // Filter the availableNetworks array and store the filtered array in a separate state variable
                setFilteredNetworks(availableNetworks.filter((network) => network.inuse !== '*'));
                console.log("stream done");
                console.log('done');
                setIsLoading(false);

            }).catch((error) => console.error(error));

        } catch (error) {
            console.error('Failed to fetch network info', error);
            setError(error);
            setIsLoading(false);
        }
    };

    const handleConnect = (ssid, password, closeModal) => {
        cockpit.spawn(['nmcli', 'dev', 'wifi', 'connect', ssid, 'password', password], {superuser: 'try'}).stream((data) => {
            if (data.includes('successfully activated')) {
                alert('Successfully connected to network : ' + ssid);
                fetchNetworkInfo().then(() => {
                    closeModal()
                });
            } else {
                alert('Failed to connect to network : ' + ssid);
                closeModal();
            }
        }).catch((error) => {
            console.error('Failed to connect to network', error);
            alert('Failed to connect to network : ' + ssid);
            closeModal();
        });

    }


    const reloadNetworkInfo = () => {
        fetchNetworkInfo();
        window.localStorage.clear();
        window.sessionStorage.clear();
    };

    return (
        <div className="container">

                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )}
                {!isLoading && (

                    <>
                        {(activeNetwork==null && retry <10) && (reloadNetworkInfo())}
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
                            <ActiveNetwork network={{inuse: true, currentNetwork: activeNetwork}}/>
                        )}
                        {!activeNetwork && (
                            <ActiveNetwork network={{inuse: false}}/>
                        )}
                        <SearchBar onSearch={handleSearch}/>
                        <NetworkTable activeNetwork={activeNetwork}
                                      otherNetworks={searchNetwork === [] ? searchNetwork : filteredNetworks}
                                      onConnect={handleConnect}/>
                        </div>
                    </>
                )}
        </div>
    );
};
