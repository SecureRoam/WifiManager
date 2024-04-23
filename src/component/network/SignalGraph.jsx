import React from 'react';
import './SignalGraph.css';
const SignalGraph = ({ signal }) => {
  const maxSignal = -30;
  const minSignal = -100;

  const signalStrength = (signal - minSignal) / (maxSignal - minSignal);
  const barWidth = `${signal}%`;

  return (
    <div className="signal-graph" >
      <div className="bar-outline"></div>
      <div className="bar" style={{ width: barWidth.toString() }}></div>
    </div>
  );
};

export default SignalGraph;
