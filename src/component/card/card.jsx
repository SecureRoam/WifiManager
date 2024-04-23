import React from 'react';
import './card.style.css';



const CustomCard = ({ network, onConnectClick }) => {
    const handleConnectClick = () => {
        onConnectClick(network.ssid);
    };

    return (
        <div className="card">
            <div className="cardHeader">
                <h3 style={{ backgroundColor: parseInt(network.signal,10) >= 65 ? '#9cc18a' : parseInt(network.signal,10) >= 34 ? '#eaac7f' : '#d86969' }}>
                    {network.ssid ? network.ssid : 'Masked Network'}
                </h3>
            </div>
            <div className="cardBody">
		<h4 className="cardTitle">In Use: {network.inuse} </h4>
                <h5 className="cardTitle">Signal: {network.bars} {network.signal}%</h5>
                <p className="cardText">Rate: {network.rate}</p>
                <p className="cardText">Channel: {parseInt(network.channel,10) > 32 ? '5Ghz' : '2.4Ghz'}</p>
                <p className="cardText" id="security">Security: {network.security}</p>
                <button className="connectButton" onClick={handleConnectClick}>
                    Connect
                </button>
            </div>
            <div className="cardFooter">2 days ago</div>
        </div>
    );
};

export default CustomCard;
