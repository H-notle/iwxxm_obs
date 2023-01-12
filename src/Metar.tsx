import React from 'react';
import { formatDiagnosticsWithColorAndContext } from 'typescript';
import { resourceLimits } from 'worker_threads';
import defaultIwxxmData from './here_is_some_data.json';

interface Props {
    iwxxmObs: string;
}
const METAR_FIELD_KEYS=  ["datetime",
                    "station",
                    "meanWindDirection_Deg",
                    "meanWindSpeed_ms",
                    "extremeClockwiseWindDirection_Deg",
                    "extremeCounterClockwiseWindDirection_Deg",
                    "prevailingVisibility_m",
                    //"cloudGroups",
                    "airTemperature_C",
                    "dewpointTemperature_C",
                    //"pressure_hPa"
                    "qnh_hPa",
                    "remarks",
                    ]
function parseMyMetarFunction(textValue: string) {
    /*const woozle = JSON.stringify(defaultIwxxmData, null, 2);
    const poozle = JSON.parse(woozle) ;
    const metarData = {};
    const extraData = {};
    for (const item in poozle) {
      //if (METAR_FIELD_KEYS.indexOf(item) != -1){
      if (METAR_FIELD_KEYS.includes(item)) {
        metarData[item] =  poozle[item] ;  
      } else {
        extraData[item] =  poozle[item] ;  
      }
    }*/
    return defaultIwxxmData;
    //return {
    //  "wind": "10KT",
    //};
  }

const Metar: React.FC<Props> = ({ iwxxmObs }) => {
  //const parsedMetar = parseMyMetarFunction(iwxxmObs);
  const parsedMetar = parseMyMetarFunction(JSON.stringify(defaultIwxxmData));

  function formatTime() {
    //date = parsedMetar['datetime'].split('-').join('').split('T').join('').split(':').join('')
    const dt = parsedMetar['datetime'].split('T');
    const date = dt[0];
    const time = dt[1].split(':');
    let dd = date.split('-')[2];
    let hh = time[0];
    let mm = time[1];
    if (dd.length === 1) {dd= '0'+dd} ;
    if (hh.length === 1) {hh= '0'+hh} ;
    if (mm.length === 1) {mm= '0'+mm};
    return dd+hh+mm ;
  }

  function formatWind() {
    const result = [];
    try {
      const roundedTo10Deg = defaultIwxxmData["meanWindDirection_Deg"]
      if (defaultIwxxmData["meanWindDirection_Deg"] < 10) {
        result.push('0'+defaultIwxxmData["meanWindDirection_Deg"]) 
      } else{
        result.push(defaultIwxxmData["meanWindDirection_Deg"])
      }
    } catch (e) {
      result.push('///')     
    }
    try {
        const knots = Number(defaultIwxxmData["meanWindSpeed_ms"]) * 1.94384;
        //const ff = knots.toFixed(0);
        if (knots < 10) {
          result.push('0'+knots.toFixed(0)) ;
        } else {
          result.push(knots.toFixed(0));
        }
 
    } catch (e) {
      result.push('//')    ; 
    }
    result.push('KT')
    return result.join('');
  }

  function formatViz() {
    let result = '////';
    try {
      let vvvv = Number(defaultIwxxmData["prevailingVisibility_m"]);
      if (vvvv >= 9999) {
        vvvv = 9999;
      }
      result = String(vvvv).padStart(4,"0")
    } catch (e) {}

    return result
  }
  /*function formatCloud(){
    const result = []
    try {
      let cgKey = defaultIwxxmData.indexOf("cloudGroups")
      const cg = defaultIwxxmData[cgKey]
      for (const each of cg){
        result.push(each)
      }
    } catch (e) {
      result.push('//////')
    }
    return result.join(' ')
  }*/

  function to_string(){
    const result = ['METAR'];
    try {
      if (defaultIwxxmData['flags'].includes('METAR')){
        result.push('AUTO');
      } else{
        throw "No METAR flag set"
      }
      /*const stn = parsedMetar['station']
      if (stn.length() != 4) {
        throw `The station ("${parsedMetar['station']}") is not 4 chars so cannot be a valid METAR station code `
      }
      if (defaultIwxxmData['station'].isAlpha()) {
        throw `The station ("${parsedMetar['station']}") contains other chars than A-Z so cannot be a valid METAR station code `
      }*/
      result.push(parsedMetar['station']);
      result.push(formatTime());
      result.push(formatWind());
      result.push(formatViz());
    } catch (e) {
      result.push('This data cannot be formatted as a METAR! because ' + e)
    }
  

    return result.join(' ')
  }

  return (
    //<div>METAR AUTO {parsedMetar.meanWindSpeed_ms}</div>
    <div>{to_string()}</div>
  )
};

export default Metar;
