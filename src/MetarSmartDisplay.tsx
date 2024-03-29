import React from 'react';
//import { forEachChild } from 'typescript';
import MetarFields, { CloudGroup } from './MetarFields';
import {DisplayUnits, formatRunwayState,is_cccc,formatTimeDDHHMM,formatWind, isCAVOK, formatViz, formatPresentWx, formatClouds, formatTemps, formatRecentWx, formatPressure, loadUnits } from "./Metar";
import MetarTacField from './MetarTacField';

interface MetarSmartDisplayProps {
  parsedMetar: MetarFields;
  displayFormat:string;
  keywordInfo:string;
  selectedKeyword:string;
}
function calculateStyling(keywords:string[],lookFor:string):string{
  let result = '';
  // if (lookFor.includes(',')){
    const manyKeywords = lookFor.split(',');
    for (const each in manyKeywords){
      if (keywords.includes(manyKeywords[each])) {
        result = '<b>'
      } 
    } 
  // } else if (keywords.includes(lookFor)) {
  //   result = '<b>'
  // } 
  return result;
} 

//const varToString = varObj => Object.keys(varObj)[0]

const MetarSmartDisplay: React.FC<MetarSmartDisplayProps> = ({parsedMetar,displayFormat,keywordInfo,selectedKeyword}) =>{
   
  const setUnits = loadUnits(displayFormat);
  const lKeywordInfo = JSON.parse(keywordInfo);   
  
  const keyPhrases = lKeywordInfo[selectedKeyword];
  const result = [];
    //const logg = ['Notes'];
    try {
      let MorS = '';
      if (parsedMetar['flags'].includes('SPECI')) {
        MorS = "SPECI" // SPECI trumps METAR... TODO should there be checks as to whether the report fits SPECI criteria?
      } else if (parsedMetar['flags'].includes('METAR')) {
        MorS = "METAR";
      }
      if (MorS !==  ''){
        if (displayFormat === 'scientific'){
          const tacField= '(notReallyA)METAR';
          result.push(MetarTacField({tacField:tacField,styling:'',elementName:'',value:''}));
          //result.push(MetarTacField('(notReallyA)METAR'));
        } else {
          result.push(MorS);
          //TODO decide any logic to do with SPECI like is it relevant any more 
        }
        if (parsedMetar['flags'].includes('CORRECTION')){
          result.push(MetarTacField({tacField:'COR',styling:'',elementName:'',value:''})); // TODO does COR trump Auto???
        } else if (parsedMetar['flags'].includes('AUTO')){
          result.push(MetarTacField({tacField:'AUTO',styling:'',elementName:'',value:''}));
        }
      } else {
        result.push(MetarTacField({tacField:'<OBS>',styling:'',elementName:'',value:''}));
      }
  
      if (!is_cccc(parsedMetar['station'] )) {
        throw new Error(`The station ("${parsedMetar['station']}") contains other chars than A-Z so cannot be a valid METAR station code `)
      }
      //console.log(`MetarSmartDisplay calling MetarTacField with ${Object.keys({myFirstName})[0]}`)
      result.push(MetarTacField({tacField:parsedMetar['station'],styling:'',elementName:'',value:''}));
      //result.push('<b> '+parsedMetar['station']+' </b>');
      result.push(MetarTacField({tacField:formatTimeDDHHMM(parsedMetar),styling:'',elementName:'',value:parsedMetar.datetime})); // strictly  MM should be mm=00/30 for METAR
      
      result.push(MetarTacField({tacField:formatWind(parsedMetar,setUnits),styling:calculateStyling(keyPhrases,'wind'),elementName:'?',value:''}));
       
      if (isCAVOK(parsedMetar) && displayFormat !== 'nz') {

        result.push(MetarTacField({tacField:'CAVOK',styling:calculateStyling(keyPhrases,'viz,wx'),elementName:'CAVOK',value:'CAVOK'}));
      
      } else {
        result.push(MetarTacField({tacField:formatViz(parsedMetar, setUnits, displayFormat),styling:calculateStyling(keyPhrases,'viz'),elementName:'',value:''}));
        const presWx =  formatPresentWx(parsedMetar);
        if (keyPhrases.includes('viz') && (presWx.includes('SH') || presWx.includes('SH') || presWx.includes('FG'))){
          result.push(MetarTacField({tacField:presWx,styling:'<b>',elementName:'',value:''}));
        } else{
          result.push(MetarTacField({tacField:presWx,styling:calculateStyling(keyPhrases,'wx'),elementName:'',value:''}));
        }

        result.push(MetarTacField({tacField:formatClouds(parsedMetar),styling:'',elementName:'formatClouds',value:''}));
      }

      result.push(MetarTacField({tacField:formatTemps(parsedMetar,setUnits),styling:calculateStyling(keyPhrases,'_C'),elementName:'airTemperature_C',value:parsedMetar.airTemperature_C}));

      const recentWx =  formatRecentWx(parsedMetar);
      if (keyPhrases.includes('viz') && (recentWx.includes('SH') || recentWx.includes('SH') || recentWx.includes('FG'))){
        result.push(MetarTacField({tacField:recentWx,styling:'<b>',elementName:'',value:''}));
      } else{
        result.push(MetarTacField({tacField:recentWx,styling:calculateStyling(keyPhrases,'wx'),elementName:'',value:''}));
      }
      //15.13.3 wind shear TODO..
      //       WS RDRDR or  WS ALL RWY
      // Information on the existence of wind shear along the take-off path or approach path 
      // between one runway level and 500 metres (1 600 ft) significant to aircraft operations 
      // shall be reported whenever available and if local circumstances so warrant, using the 
      // group set WS RDRDR repeated as necessary. If the wind shear along the take-off path or 
      // approach path is affecting all runways in the airport, WS ALL RWY shall be used.
      //TODO 15.13.5 Sea-surface temperature and the state of the sea (WTsTs/SS') or sea-surface temperature
      // and the significant wave height (WTsTs/HHsHsHs)
      
      //console.log(`MetarSmartDisplay calling MetarTacField with ${Object.keys({parsedMetar.qnh_hPa})[0]}`)
      result.push(MetarTacField({tacField:formatPressure(parsedMetar, setUnits),styling:calculateStyling(keyPhrases,'pressure'),elementName:'qnh_hPa',value:parsedMetar.qnh_hPa}));
      result.push(MetarTacField({tacField:formatRunwayState(parsedMetar),styling:calculateStyling(keyPhrases,'runway'),elementName:'',value:''}));
  
      if (parsedMetar['remarks']) {
        result.push(MetarTacField({tacField:'RMK',styling:'',elementName:'',value:''}));
        result.push(MetarTacField({tacField:parsedMetar['remarks'].toUpperCase(),styling:'',elementName:'',value:''}));
      }
      result.push(MetarTacField({tacField:'=',styling:'',elementName:'',value:''}));
      //TODO runway info
      //TODO trend
    } catch (e) {
      result.push(MetarTacField({tacField:'This data cannot be formatted as a METAR! because ' + e, styling : '<b>', elementName : '',value:''}));
      //throw new Error('This data cannot be formatted as a METAR!',{cause : e});
    }
    return (  
      //<div style={{ display: 'flex', flexDirection:'row',  justifyContent: 'space-between'}}>{result}</div>
      <div style={{ display: 'flex', flexDirection:'row',  margin:'20px', alignItems:'centre', columnGap:'5px'}}>{result}</div>
    )  

  }
  export default MetarSmartDisplay; 