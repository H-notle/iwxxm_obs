import React from 'react';
//import { forEachChild } from 'typescript';
import MetarFields, { CloudGroup } from './MetarFields';
import { lr_loadUnits,load1minuteWind, LocalReportDisplayUnits, lr_formatTemp, maxTimeSeries, minTimeSeries } from './Localreport';
import {DisplayUnits, formatRunwayState,is_cccc,formatTimeDDHHMM,icaoNumberStr,icaoNumberStr2orMore,formatWind, isCAVOK, formatViz, formatPresentWx, formatClouds, formatTemps, formatRecentWx, formatPressure, loadUnits } from "./Metar";
import MetarTacField from './MetarTacField';
import { valueRoundedDownto100s } from './library';

function lr_formatWind(parsedMetar : MetarFields, setUnits:DisplayUnits) :string{
  const result = [];
  let ddd = '///';
  let ff  = '//';
  let gg = '';
  let gMin = '';
  let wind = '';
  try {
    result.push('WIND'); 
    //const roundedTo10Deg = parsedMetar["meanWindDirection_Deg"]
    if (parsedMetar["meanWindSpeed_ms"] <= 3){ /// not sure these units are correct
      result.push('VRB'); 
    } else if (parsedMetar["meanWindDirection_Deg"] > 360) {
      result.push('///');
    } else{
      var ddd10 = Math.round(parsedMetar["meanWindDirection_Deg"] / 10.0);
      if (ddd10 === 0) {
        ddd10 = 36;
      } 
      ddd = icaoNumberStr(ddd10 * 10,3,false);         
    }
  } catch (e) {
  }
  // no checking of wind cf gust values > 5 knots etc  (wait for colour highlighting...)
  try {
    // TODO this is not strictly correct as LOCAL reports are averages over 2 mins not 10 as METARs are  
    if (parsedMetar["meanWindSpeed_ms"] ){
      ff = `${Math.ceil(parsedMetar["meanWindSpeed_ms"]*setUnits['windSpeed'])}`;  
      if (ff.length === 1) {
        ff = `/${ff}`
      }  

      if (parsedMetar["gust_ms"]) {
        gg = `MAX ${icaoNumberStr2orMore(parsedMetar["gust_ms"]*setUnits['windSpeed'])}`;
      } else {
        const maxWind = load1minuteWind(parsedMetar,maxTimeSeries); 
        const minWind = load1minuteWind(parsedMetar,minTimeSeries);
        console.log(`lr_formatWind maxWind=${maxWind}, minWind = ${minWind}`) 
        if (!isNaN(maxWind)){
          gg = `MAX ${Math.ceil(maxWind*setUnits['windSpeed'])}`
        }
        if (!isNaN(minWind)){
          gMin = `MNM ${Math.ceil(minWind*setUnits['windSpeed'])}`
        }
      }

    }      
    //result.push(setUnits['windSpeedUnits']);
  } catch (e) {
    //result.push('//'); 
  }
  wind = `${ddd}${ff}${setUnits['windSpeedUnits']}`;
  if (gg !== ''){
    wind = `${wind} ${gg}`;
  } 
  if (gMin !== ''){
    wind = `${wind} ${gMin}`;
  }
  return wind; 
}
export function lr_formatViz(parsedMetar : MetarFields, setUnits:DisplayUnits,displayFormat:string) {
  let result = 'VIS ////';
  if (setUnits['visibilityUnits'] === 'SM'){
    if (parsedMetar["prevailingVisibility_m"]){
      const sm = parsedMetar["prevailingVisibility_m"] * 0.000621371192;
      if (sm < 0.50) {
        result = 'VIS 1/4SM';
      } else if (sm < 0.75) {
        result = 'VIS 1/2SM';
      } else if (sm < 1.0) {
        result = 'VIS 3/4SM';
      } else if (sm > 15.0) {
        result = 'VIS 15SM';
      } else {
        result = `VIS ${Math.floor(sm)}SM`;
      }
    }
  } else {
    try {
      let vvvv = Number(parsedMetar["prevailingVisibility_m"]);
      if (displayFormat === 'nz' && parsedMetar["prevailingVisibility_m"] > 9999) {
        result = `${Math.round(parsedMetar["prevailingVisibility_m"]/1000)}KM`;
      } else {  
        if (vvvv >= 9999) {
          vvvv = Math.floor(vvvv/1000) * 1000;
        } else if (vvvv < 800) {
          vvvv = Math.floor(vvvv/50) * 50;
        } else if (vvvv < 5000) {
          vvvv = Math.floor(vvvv/100) * 100;
        } else{  
          vvvv = Math.floor(vvvv/1000) * 1000;
        }
        result = `VIS ${String(vvvv).padStart(4,"0")}M`;
      }
      //TODO VnVnVnVnDv
      // todo RDRDR/VRVRVRVRi R+dd+(L|C|R|none)+vvvv and there are the whole if more than/less/than... 1000/half....
      //TODO RVR
  
    } catch (e) {
      // TODO what?  
    }
  }
  return result;
}

function split_presWx(s:string){
  let result = '';
  let bits = [];
  let n = 0;
  while (n < s.length){
    let wx = s.slice(n,n+2);
    bits.push(wx);
    n = n + 2;
  }
  result= bits.join(' ');
  return result;
}

function lr_formatPresentWx(parsedMetar : MetarFields){
  let result = '';
  if (parsedMetar["presentWeather"]){
    if (parsedMetar["presentWeather"].includes('+')){
      result = `MOD ${split_presWx(parsedMetar["presentWeather"].replaceAll('+',''))}`;
    }else {
      // don't know if there is a keyword equiv of "-"
      result = `${split_presWx(parsedMetar["presentWeather"].replaceAll('-',''))}`;
    }
  }
  return result;
}

export function lr_formatCloud(cg: CloudGroup,displayFormat:LocalReportDisplayUnits){
  const result = []
  try {
    if (['FEW','SCT','BKN','OVC'].includes(cg['cloudKey'])){
      result.push(cg['cloudKey']);
    } else {
      result.push('///');
    }  
    //cloudType
    if(['CB','TCU'].includes(cg['cloudType'])){
      result.push(cg['cloudType']);
    }

    result.push(`${valueRoundedDownto100s(cg['flightLevel']*100/displayFormat['heightFtConversion'])}${displayFormat['heightUnits']}`);

  } catch(e) {
    result.push('/// ///');
  }
  return result.join(' ');    
}

export function lr_formatClouds(parsedMetar : MetarFields,displayFormat:LocalReportDisplayUnits){
  // TODO validate clouds are in ascending order and increasing octas ...
  // TODO doesn't check if only 1 is CB/TCU
  const result = ['CLD'];
  try {
    if (parsedMetar["cloudGroups"].length === 0) {
      return 'SKC' // prob not strictly correct... NCD etc
    }
    if (['SKC','NCD','NSC'].includes(parsedMetar["cloudGroups"][0]['cloudKey'])){
      return parsedMetar["cloudGroups"][0]['cloudKey'];
    }

    if (parsedMetar["cloudGroups"].length > 3) {
        console.log('what to do with more than 3 cloud groups..... sod it (can\'t show them all! ');
        return '////// ////// //////';
    }
    for (const each of parsedMetar["cloudGroups"]){
      result.push(lr_formatCloud(each,displayFormat));
    }
  } catch (e) {
    result.push('//////');
  }
  return result.join(' ');
}

interface LocalreportSmartDisplayProps {
  parsedMetar: MetarFields;
  displayFormat:string;
  keywordInfo:string;
  selectedKeyword:string;
}
function calculateStyling(keywords:string[],lookFor:string):string{
  let result = '';
    const manyKeywords = lookFor.split(',');
    for (const each in manyKeywords){
      if (keywords.includes(manyKeywords[each])) {
        result = '<b>'
      } 
    } 

  return result;
} 

function formatT(parsedMetar : MetarFields, setUnits:LocalReportDisplayUnits){
  return `T${lr_formatTemp(parsedMetar["airTemperature_C"],setUnits)}`;
} 

function formatTd(parsedMetar : MetarFields, setUnits:LocalReportDisplayUnits){
  return `DP${lr_formatTemp(parsedMetar["dewpointTemperature_C"],setUnits)}`;

} 
//const varToString = varObj => Object.keys(varObj)[0]
export function lr_formatPressure(parsedMetar : MetarFields, setUnits:LocalReportDisplayUnits) {
  /*for scientific ...maybe  MSLP*/
  const result = [];
  //console.log(` formatPressure WS=${parsedMetar["qnh_hPa"]} out units= ${setUnits['pressureUnits']}`);
  if (setUnits['pressureUnits'] === 'inHg'){
    result.push('A ');
  } else{
    result.push('QNH ');
  }
//TODO  if < 950 or > 1050 (check the rules) ...prob should be //// 
  try {
    var p = parsedMetar['qnh_hPa'];
    if (!p){//(Number.isNaN(p)){
      result.push('////'); 
    } else{
      result.push(icaoNumberStr(Math.floor(parsedMetar['qnh_hPa'] * setUnits['pressure']),4,true)); // P3 true = round down
      result.push(setUnits['pressureUnits'].toUpperCase());
    }
  } catch(e){
      result.push('////');
  }
  return result.join('');
}

const LocalreportDisplay: React.FC<LocalreportSmartDisplayProps> = ({parsedMetar,displayFormat,keywordInfo,selectedKeyword}) =>{
   
  const setUnits = lr_loadUnits(displayFormat);
  const lKeywordInfo = JSON.parse(keywordInfo);   
  
  const keyPhrases = lKeywordInfo[selectedKeyword];
  const result = [];
  console.log(`-----------------------LocalreportDisplay displayFormat=${displayFormat}`)
  if (displayFormat === 'nz'){
    result.push(':(--------------- NZ does not do Local reports! ---------------):')
  } else{
    //const logg = ['Notes'];
    try {
      let MorS = '';
      if (parsedMetar['flags'].includes('SPECIAL')) {
        MorS = "SPECIAL" // SPECI trumps METAR... TODO should there be checks as to whether the report fits SPECI criteria?
      } else if (parsedMetar['flags'].includes('LOCAL')) {
        MorS = "MET REPORT";
      }
      if (MorS !==  ''){
        if (displayFormat === 'scientific'){
          const tacField= '(pseudo)MET REPORT';
          result.push(MetarTacField({tacField:tacField,styling:'',elementName:'',value:''}));
          //result.push(MetarTacField('(notReallyA)METAR'));
        } else {
          result.push(MorS);
          //TODO decide any logic to do with SPECI like is it relevant any more 
        }
        // if (parsedMetar['flags'].includes('CORRECTION')){
        //   result.push(MetarTacField({tacField:'COR',styling:'',elementName:'',value:''})); // TODO does COR trump Auto???
        // } else if (parsedMetar['flags'].includes('AUTO')){
        //   result.push(MetarTacField({tacField:'AUTO',styling:'',elementName:'',value:''}));
        // }
      } else {
        result.push(MetarTacField({tacField:'<OBS>',styling:'',elementName:'',value:''}));
      }
  
      if (!is_cccc(parsedMetar['station'] )) {
        throw new Error(`The station ("${parsedMetar['station']}") contains other chars than A-Z so cannot be a valid METAR station code `)
      }
      //console.log(`MetarSmartDisplay calling MetarTacField with ${Object.keys({myFirstName})[0]}`)
      result.push(MetarTacField({tacField:parsedMetar['station'],styling:'',elementName:'',value:''}));
      //result.push('<b> '+parsedMetar['station']+' </b>');
      result.push(MetarTacField({tacField:formatTimeDDHHMM(parsedMetar)+'Z',styling:'',elementName:'',value:parsedMetar.datetime})); // strictly  MM should be mm=00/30 for METAR
      
      result.push(MetarTacField({tacField:lr_formatWind(parsedMetar,setUnits),styling:calculateStyling(keyPhrases,'wind'),elementName:'?',value:''}));

      // if (isCAVOK(parsedMetar) && displayFormat !== 'nz') {

      //   result.push(MetarTacField({tacField:'CAVOK',styling:calculateStyling(keyPhrases,'viz,wx'),elementName:'CAVOK',value:'CAVOK'}));
      
      // } else {
        result.push(MetarTacField({tacField:lr_formatViz(parsedMetar, setUnits, displayFormat),styling:calculateStyling(keyPhrases,'viz'),elementName:'',value:''}));
        const presWx =  lr_formatPresentWx(parsedMetar);
        if (keyPhrases.includes('viz') && (presWx.includes('SH') || presWx.includes('SH') || presWx.includes('FG'))){
          result.push(MetarTacField({tacField:presWx,styling:'<b>',elementName:'',value:''}));
        } else{
          result.push(MetarTacField({tacField:presWx,styling:calculateStyling(keyPhrases,'wx'),elementName:'',value:''}));
        }

        result.push(MetarTacField({tacField:lr_formatClouds(parsedMetar,setUnits),styling:'',elementName:'formatClouds',value:''}));
      // }

      result.push(MetarTacField({tacField:formatT(parsedMetar,setUnits),styling:calculateStyling(keyPhrases,'_C'),elementName:'airTemperature_C',value:parsedMetar.airTemperature_C}));

      result.push(MetarTacField({tacField:formatTd(parsedMetar,setUnits),styling:calculateStyling(keyPhrases,'_C'),elementName:'dewpointTemperature_C',value:parsedMetar.airTemperature_C}));

      //TODO is there recent wx?
      // const recentWx =  formatRecentWx(parsedMetar);
      // if (keyPhrases.includes('viz') && (recentWx.includes('SH') || recentWx.includes('SH') || recentWx.includes('FG'))){
      //   result.push(MetarTacField({tacField:recentWx,styling:'<b>',elementName:'',value:''}));
      // } else{
      //   result.push(MetarTacField({tacField:recentWx,styling:calculateStyling(keyPhrases,'wx'),elementName:'',value:''}));
      // }
 
      result.push(MetarTacField({tacField:lr_formatPressure(parsedMetar, setUnits),styling:calculateStyling(keyPhrases,'pressure'),elementName:'qnh_hPa',value:parsedMetar.qnh_hPa}));
      //result.push(MetarTacField({tacField:formatRunwayState(parsedMetar),styling:calculateStyling(keyPhrases,'runway'),elementName:'',value:''}));
  
      // if (parsedMetar['remarks']) {
      //   result.push(MetarTacField({tacField:'RMK',styling:'',elementName:'',value:''}));
      //   result.push(MetarTacField({tacField:parsedMetar['remarks'].toUpperCase(),styling:'',elementName:'',value:''}));
      // }
      result.push(MetarTacField({tacField:'=',styling:'',elementName:'',value:''}));
      //TODO runway info
      //TODO trend
    } catch (e) {
      result.push(MetarTacField({tacField:'This data cannot be formatted as a METAR! because ' + e, styling : '<b>', elementName : '',value:''}));
      //throw new Error('This data cannot be formatted as a METAR!',{cause : e});
    }
    }  return (  
      //<div style={{ display: 'flex', flexDirection:'row',  justifyContent: 'space-between'}}>{result}</div>
      <div style={{ display: 'flex', flexDirection:'row',  margin:'20px', alignItems:'centre', columnGap:'5px'}}>{result}</div>
    )  
    
}
export default LocalreportDisplay; 