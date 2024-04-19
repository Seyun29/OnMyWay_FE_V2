const markerBasicDefault = require('../../assets/images/markers/markerBasicDefault.png');
const markerBasicOff = require('../../assets/images/markers/markerBasicOff.png');
const markerBasicOn = require('../../assets/images/markers/markerBasicOn.png');
const markerStart = require('../../assets/images/markers/markerStart.png');
const markerEnd = require('../../assets/images/markers/markerEnd.png');
const markerStopover = require('../../assets/images/markers/markerStopover.png');

export const markerList = {
  start: markerStart,
  end: markerEnd,
  stopover: markerStopover,
  basic: {
    default: markerBasicDefault,
    off: markerBasicOff,
    on: markerBasicOn,
  },
};

//below two are red (in default) - alternatives : blue
export const markerCurPosDirected = require('../../assets/images/markers/markerCurPosDirected.png');
export const markerCurPosUndirected = require('../../assets/images/markers/markerCurPosUndirected.png');
