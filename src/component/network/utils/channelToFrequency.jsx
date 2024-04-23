import React from 'react';

function channelToFrequency(channel) {
  if (channel >= 1 && channel <= 14) {
    // 2.4 GHz band
    return `2.4 GHz`;
  } else if (channel >= 36 && channel <= 165) {
    // 5 GHz band
    return `5 GHz`;
  } else {
    return 'Unknown';
  }
}

export default channelToFrequency;
