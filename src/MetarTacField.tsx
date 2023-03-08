import React from 'react';

//import { forEachChild } from 'typescript';
import MetarFields, { CloudGroup } from './MetarFields';

// interface ExtraNonMetarFields{
//   key: string;
//   value: any;
// }

interface MetarTacFieldProps {
  // metar: MetarFields;
  // displayFormat:string;
  // keywordInfo:string;
  // selectedKeyword:string;
  tacField:string;
  styling?:string;
}
const MetarTacField: React.FC<MetarTacFieldProps> = ({tacField,styling}) =>{//metar,displayFormat,keywordInfo,selectedKeyword }) => {
  // var parsedMetar = metar;   
  // const setUnits = loadUnits(displayFormat);
  // const lKeywordInfo = JSON.parse(keywordInfo);   
  // if (!parsedMetar.meanWindSpeed_ms){
  //   //console.log('Metar calling load1minuteWind');
  //   parsedMetar.meanWindSpeed_ms = load1minuteWind(parsedMetar); 
  //   //console.log(`Metar called load1minuteWind wind speed=${parsedMetar.meanWindSpeed_ms}`);
  // }
  // const keyPhrases = lKeywordInfo[selectedKeyword];
  // //console.log(`Metar keyPhrases =${keyPhrases}`)
  if (styling &&  styling === '<b>') {
    return (  
        <div><b>{tacField}</b></div>
        // <div>abc</div>
        )     
     
  } else{
    return (  
      <div>{tacField}</div>
      // <div>abc</div>
    )
 }
}

export default MetarTacField;