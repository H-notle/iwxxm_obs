import React from 'react';
import { formatDiagnosticsWithColorAndContext } from 'typescript';
import { isStringObject } from 'util/types';
import { resourceLimits } from 'worker_threads';
import defaultIwxxmData from './here_is_some_data.json';

interface Props {
    jsonObs: string;
}
// interface EditableDataXX{
//   test101: string;
// }
interface EditableData {
  key: string;
  value: any;
}

const METAR_FIELD_KEYS=  ["datetime",
                    "station",
                    "meanWindDirection_Deg",
                    "meanWindSpeed_ms",
                    "extremeClockwiseWindDirection_Deg",
                    "extremeCounterClockwiseWindDirection_Deg",
                    "prevailingVisibility_m",
                    "cloudGroups",
                    "airTemperature_C",
                    "dewpointTemperature_C",
                    "pressure_hPa",
                    "qnh_hPa",
                    "remarks",
                    "trend"
                    ]
function parseMyMetarFunction(textValue: string) {
    //try{
        const editableData = defaultIwxxmData
        const prevData = defaultIwxxmData
        try{
            const strjson = JSON.stringify(defaultIwxxmData, null, 2);
        } catch (e){
            console.log(`parseMyMetarFunction exception ${e}`)
        }
        return editableData;
    //} catch (e){
    //    console.log(`json is not kosher ${e}`);
    //}
  }
  function editableData(){
    return defaultIwxxmData
  }
  function loadString(val:string){
    return val
  }  

const JSONMetar: React.FC<Props> = ({ jsonObs }) => {
  const parsedMetar = parseMyMetarFunction(jsonObs);

  function formatTimeDDHHMM() {
    // brutal string chopping - avoids JS mucking around with locale 
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

  function to_string(){
    const result = ['METARxx'];
    const logg = ['Notes']
    //const rec = Record <string, string | number | boolean>
    const keys =  parsedMetar // = parseMyMetarFunction(jsonObs);
    result.push('[');
     for (const item in parsedMetar){
        result.push(`found "${item}"`)
     } 
     result.push(']');
    try {
      if (defaultIwxxmData['flags'].includes('METAR')){
        result.push('AUTO');
      } else{
        throw "No METAR flag set"
      }


      if (!is_cccc(parsedMetar['station'] )) {
        throw `The station ("${parsedMetar['station']}") contains other chars than A-Z so cannot be a valid METAR station code `
      }
      result.push(parsedMetar['station']);
      //result.push(formatTimeDDHHMM());
      //result.push(formatWind());
      //result.push(formatViz());
    } catch (e) {
      result.push('This data cannot be formatted as a METAR! because ' + e)
    }
  
    return result.join(' ') + ' >>>>' + logg.join('\n')
  }

  return (
    //<div>METAR AUTO {parsedMetar.meanWindSpeed_ms}</div>
   <div>{to_string()}</div> 
  )
};
function is_cccc (st:string) {
  return st.length === 4 && st.match('[A-Z]');
}

export default JSONMetar;
