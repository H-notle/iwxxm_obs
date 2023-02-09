import { ListClassKey } from '@material-ui/core';
import React from 'react';
//import { keys } from 'ts-transformer-keys';
import { convertCompilerOptionsFromJson, createSemicolonClassElement, formatDiagnosticsWithColorAndContext } from 'typescript';
import { resourceLimits } from 'worker_threads';
//import defaultIwxxmData from './here_is_some_data.json';

interface CloudGroup {
  cloudKey : ('SCT' | 'FEW' | 'BKN' | 'OVC');// [];
  flightLevel : number;
  cloudType: ('' | 'TCU' | 'CB');
}

interface Props {
    iwxxmObs: string;
    displayFormat:string;
}

interface DisplayUnits{
  windSpeed : number;
  windSpeedUnits : string;
  //temperature : number;
  temperatureUnits : string;
  pressure :number;
  pressureUnits :string;
  windSpeedDesc : string;
  temperatureDesc : string;
  pressureDesc :string; 
}
interface RunwayInfo{
    runwayCode : string;
    wxCode1 : number;
    wxCode2 : number;
    runwayState : number;
}

interface MetarFields  {
  datetime : string;
  station : string;
  flags: string []; //('AUTO' | "WOOZLE" | 'METAR')[]; 
  meanWindDirection_Deg: number;
  meanWindSpeed_ms: number;
  extremeClockwiseWindDirection_Deg: number;
  extremeCounterClockwiseWindDirection_Deg: number;
  prevailingVisibility_m: number;
  cloudGroups: CloudGroup [];
  airTemperature_C: number;
  dewpointTemperature_C: number;
  qnh_hPa: number;
  runwayInfo:RunwayInfo;
  remarks: string;
  trend: string;
  extras: Record<string, string | number| boolean>;
}
interface Extra {
  key: string | number| boolean | Object;
}

const METAR_FIELD_KEYS=  ["datetime",
                    "station",
                    "flags",
                    "meanWindDirection_Deg",
                    "meanWindSpeed_ms",
                    "extremeClockwiseWindDirection_Deg",
                    "extremeCounterClockwiseWindDirection_Deg",
                    "prevailingVisibility_m",
                    "cloudGroups",
                    "airTemperature_C",
                    "dewpointTemperature_C",
                    "qnh_hPa",
                    "runwayInfo",
                    "remarks",
                    "trend"
                    ]

function celciusToFahrenheit(c:number) : number{
  return (c * 9.0)/5.0 + 32.0; 
}
function celciusToKelvin(c:number):number{
  return c + 273.16;
}

function loadUnits(displayFormat:string): DisplayUnits {
  // TODO watch C/C laugh when they see this...
  //console.log(`loadUnits displayFormat="${displayFormat}"`)
  var results: DisplayUnits={
    windSpeed : 1.94384,
    windSpeedUnits:'',
    temperatureUnits : 'C',
    pressure : 1.0,
    windSpeedDesc : 'wind speed is knots',
    temperatureDesc : 'temperature is Celcius',
    pressureUnits:'hPa',
    pressureDesc : 'pressure is HPa' 
  }

  if (displayFormat === 'american') {
    console.log(`loadUnits changing units to be ="${displayFormat}"`)
    results = {
      
      windSpeed : 2.23694,
      windSpeedUnits:'MPH',
      temperatureUnits : 'F',//celciusToFahrenheit, // what do do here ... needs a function ...(t * 9/5)+32
      pressure : 1 / .338639, // hPa to inches of Hg - I think thats correct!!!
      windSpeedDesc : 'wind speed is MPH',
      temperatureDesc : 'temperature is Fahrenheit',
      pressureUnits : 'inHg',
      pressureDesc : 'pressure is inches of mercury' 
    }
       
  }  else if (displayFormat === 'international') {
    results ={
      windSpeed : 1.94384,
      windSpeedUnits : '',
      temperatureUnits : 'C',//celciusToCelcius,
      pressure : 1.0,
      windSpeedDesc : 'wind speed is knots',
      temperatureDesc : 'temperature is Celcius',
      pressureUnits:'hPa',
      pressureDesc : 'pressure is hPa' 
    }
  } else if (displayFormat === 'scientific') {
    results ={
      windSpeed : 1,
      windSpeedUnits:'MPS', // lightyears
      temperatureUnits : 'K',// + 273.25, // todo
      pressure : 100,
      pressureUnits:'Pa',
      windSpeedDesc : 'wind speed is who knows',
      temperatureDesc : 'temperature is not yet kelvin',
      pressureDesc : 'pressure is Pa' 
    }
  }  else if (displayFormat === 'nz') {
    results ={
      windSpeed : 1.94384,
      windSpeedUnits : '',
      temperatureUnits : 'C',//celciusToCelcius,
      pressure : 1.0,
      windSpeedDesc : 'wind speed is knots',
      temperatureDesc : 'temperature is Celcius',
      pressureUnits:'hPa',
      pressureDesc : 'pressure is hPa' 
    }
  }
  return results;
}  

// function createKeys(keyRecord: Record<keyof MetarFields, any>): (keyof MetarFields)[] {
//   return Object.keys(keyRecord) as any
// }

// "remarks": "This is a pretty cool",

function parseMyMetarFunction(textValue: string):MetarFields {

  return JSON.parse(textValue);

    //const kk = keys(MetarFields)
    //type KeysEnum<T> = { [P in keyof Required<T>]: true };
    //const keys : KeysEnum<MetarFields>= {};
      //id: true,
      //name: true,
    //const keys = createKeys({ isDeleted: 1, createdAt: 1, title: 1, id: 1 })
    //type keys = keyof([x:string] : MetarFields);
    


    //console.log(`keys in MetarFields are: ${keys}`);
    }

function icaoNumberStr(n:number,maxDigits:number,roundDown:boolean ){
  /* eg
   icaoNumberStr(1234,5,true) -> "01234" ! 
   icaoNumberStr(1234,4,true) -> "1234" ! too long so chops leading digit off
   icaoNumberStr(1234,3,true) -> "234"  !  too long so chops leading digit off
   icaoNumberStr(1024,3,true) -> "024"  ! too long so chops leading digit off
   icaoNumberStr(1.6,1,false) -> "2"
   icaoNumberStr(1.6,1,true) -> "1"
   icaoNumberStr(1,3,true) -> "001"
  */
  try{
    var nn = n;
    if (roundDown) {
      nn= Math.floor(nn);
    }
    if (nn > maxDigits) {
      const mod = 10 ** maxDigits;
      nn = nn % mod; 
    }
    nn = Math.round(nn);
    const result = '0000' + nn;
    return result.slice(-maxDigits);
  } catch(e) {
    return '//////////'.slice(-maxDigits);
  }
}
//function loadExtraData(textValue: string):Extra[]{
  function loadExtraData(textValue: string){
    const j = JSON.parse(textValue);
  const result = new Array();
  for (const each in j){
    
    if (METAR_FIELD_KEYS.includes(each)){
      console.log(`getloadExtraData have key "${each}" is a METAR field`);
    } else{
      console.log(`getloadExtraData have key "${each}" is NOT a METAR field`);
      //const extra 
      //const ext : Extra ="key":each,value:j[each]);
      result.push({"key":each,"value":j[each]});
    }
  }


  return result; 
}
function dumpArray(a:any[]){
  for (const each in a){
    console.log(`have key ${each} ${a[each]["key"]} value: ${a[each]["value"]}`);
  }
} 




const Metar: React.FC<Props> = ({ iwxxmObs,displayFormat }) => {
  //const parsedMetar = parseMyMetarFunction(iwxxmObs);
  try{
    var parsedMetar = parseMyMetarFunction(iwxxmObs);
     
    //for (eachField:string in iwxxmObs
      //METAR_FIELD_KEYS
    const extras = loadExtraData(iwxxmObs);
    dumpArray(extras);
    console.log(`extras:${extras}`);
  } catch (e){
    console.log(`Error loading json data: ${e}`);
  }
  const setUnits = loadUnits(displayFormat);
  function formatTimeDDHHMM() {
    //date = parsedMetar['datetime'].split('-').join('').split('T').join('').split(':').join('')
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
    // var z = '?'
    // if (displayFormat === 'international'){
    //   z = 'Z';
    // } else{
    //   z = '!'
    // }
    return dd+hh+mm;
  }
  function dirRoundTo10Deg(d:number) : number {
    return 10 * Math.round(d/10.0);
  }
  function formatWind() {
    const result = [];
    try {
      //const roundedTo10Deg = parsedMetar["meanWindDirection_Deg"]
      if (parsedMetar["meanWindDirection_Deg"] > 360) {
        result.push('///')
      } else{
        var ddd10 = Math.round(parsedMetar["meanWindDirection_Deg"] / 10.0);
        if (ddd10 === 0) {
          ddd10 = 36;
        } 
        result.push(icaoNumberStr(ddd10 * 10,3,false));         
      }

    } catch (e) {
      result.push('///');   
    }

    try {
      //console.log(` formatwind WS=${parsedMetar["meanWindSpeed_ms"]} out units= ${setUnits['windSpeed']}`)
      result.push(icaoNumberStr(parsedMetar["meanWindSpeed_ms"]*setUnits['windSpeed'],2,false));
      result.push(setUnits['windSpeedUnits']);

  } catch (e) {
    result.push('//'); 
  }
  const windVarResult = [];
  //try{
  if (parsedMetar["extremeCounterClockwiseWindDirection_Deg"]){
    windVarResult.push(icaoNumberStr(dirRoundTo10Deg(parsedMetar["extremeCounterClockwiseWindDirection_Deg"]),3,false));
  } else {
    windVarResult.push('///');
  }
  //} catch (e){
  //  windVarResult.push('///');
  //}

  windVarResult.push('/');

  //try{
  if (parsedMetar["extremeClockwiseWindDirection_Deg"]){
    windVarResult.push(icaoNumberStr(dirRoundTo10Deg(parsedMetar["extremeClockwiseWindDirection_Deg"]),3,false));
  } else {
    windVarResult.push('///');  
  }
  // } catch (e){
  //   windVarResult.push('///');
  // }
  const sWindVar = windVarResult.join('');
  if (sWindVar != '///////') {
    result.push(` ${sWindVar}`);
    } 
    return result.join('');
  }

  function formatViz() {
    let result = '////';
    try {
      if (displayFormat === 'nz' && parsedMetar["prevailingVisibility_m"] > 9999) {
        result = `${Math.round(parsedMetar["prevailingVisibility_m"]/1000)}KM`;
      } else{
      let vvvv = Number(parsedMetar["prevailingVisibility_m"]);
      if (vvvv >= 9999) {
        vvvv = 9999;
      }
      result = String(vvvv).padStart(4,"0");
    }
    } catch (e) {}

    return result
  }
  function formatCloud(cg: CloudGroup){
    const result = []
    try {
      if (['FEW','SCT','BKN','OVC'].includes(cg['cloudKey'])){
        result.push(cg['cloudKey']);
      } else {
        result.push('///');
      }  
      result.push(icaoNumberStr(cg['flightLevel'],3,false));
      
      
      //cloudType
      if(['CB','TCU'].includes(cg['cloudType'])){
        result.push(cg['cloudType']);
      }
      //if (cg['cb']){
      //  result.push('CB');
      //}
      //"cloudType":"TCU",

    } catch(e) {
      result.push('///////');
    }
    return result.join('');    
  }
  function formatClouds(){
    //const clouds = parsedMetar["cloudGroups"];
    //TODO validate clouds are in ascending order and increasing octas ...
    // TODO doesn't check if only 1 is CB/TCU
    const result = [];
    try {
       if (parsedMetar["cloudGroups"].length > 3) {
          console.log('what to do with more than 3 cloud groups..... sod it! ');
          return '////// ////// //////'
       }
      for (const each of parsedMetar["cloudGroups"]){
        result.push(formatCloud(each));
      }
    } catch (e) {
      result.push('//////');
    }
    return result.join(' ')
  }
  function formatTemp(tt : number){
    const result = [];
    try {
       var t = tt;
       var maxdigits=2;

       if (setUnits['temperatureUnits'] ==='F') {
          t = celciusToFahrenheit(t);
          maxdigits = 3;
       } else if (setUnits['temperatureUnits'] ==='K') {
          t = celciusToKelvin(t);
          maxdigits = 3;
       }

       if (t < 0){
        result.push('M');
        t = -t;
       } 
       result.push(icaoNumberStr(t,maxdigits,false))
       
    } catch (e){
       result.push('//');
    }  

    return result.join('');
  }

  function formatTemps(){
    const tt = parsedMetar["airTemperature_C"];
    const td = parsedMetar["dewpointTemperature_C"];
    const result = [];
    result.push(formatTemp(tt));
    result.push('/');
    result.push(formatTemp(td));
    if (!['','C'].includes(setUnits['temperatureUnits'])) {
      result.push(setUnits['temperatureUnits']);
    }
    return result.join('');
  } 


  function formatPressure() {
    const result = [];
    console.log(` formatPressure WS=${parsedMetar["qnh_hPa"]} out units= ${setUnits['pressureUnits']}`)
    if (setUnits['pressureUnits'] === 'inHg'){
      result.push('A');
    } else{
      result.push('Q');

    }
    try{
      var p = parsedMetar['qnh_hPa']
      if (Number.isNaN(p)){
        return '////'; // TODO sort this ... should work but....
      }
      result.push(icaoNumberStr(Math.floor(parsedMetar['qnh_hPa'] * setUnits['pressure']),4,true)); // P3 true = round down
    } catch(e){
        result.push('////');
    }
    return result.join('');
  }
  function isCAVOK():boolean {
    var result = true;
    for (const each of parsedMetar["cloudGroups"]){
      if (each['flightLevel'] < 50) {
        result = false;
      } else if (each['cloudType'] === 'TCU') {
        result = false;
      } else if (each['cloudType'] === 'CB') {
        result = false;
      }
    }
    if (result && parsedMetar['prevailingVisibility_m'] < 9999){
      result = false;
    }
    //TODO more once trends are added
    return result;
  }

  function formatRunwayState(){
    const result = [];
    result.push(`${parsedMetar['runwayInfo']['runwayCode']}`);
    result.push(`${parsedMetar['runwayInfo']['wxCode1']}`);
    result.push(`${parsedMetar['runwayInfo']['wxCode2']}`);
    result.push(`${parsedMetar['runwayInfo']['runwayState']}`);
    return result.join('');
  }
  function to_string(){
    const result = [];
    const logg = ['Notes']
    try {

      if (parsedMetar['flags'].includes('METAR')){
        if (displayFormat === 'scientific'){
          result.push('(notReallyA)METAR')
        } else {
          result.push('METAR');
        }
        if (parsedMetar['flags'].includes('AUTO')){
          result.push('AUTO');
        }
      } else {
        result.push('<OBS>');
      }

      if (!is_cccc(parsedMetar['station'] )) {
        throw `The station ("${parsedMetar['station']}") contains other chars than A-Z so cannot be a valid METAR station code `
      }
      result.push(parsedMetar['station']);
      result.push(formatTimeDDHHMM());
      result.push(formatWind());
      //TODO CAVOK...
      if (isCAVOK() && displayFormat != 'nz') {
        result.push('CAVOK');
      } else{
        result.push(formatViz());

        result.push(formatClouds());
      }
      result.push(formatTemps());
      result.push(formatPressure());
      result.push(formatRunwayState());

      if (parsedMetar['remarks']) {
        result.push('RMK');
        result.push(parsedMetar['remarks'].toUpperCase());
      }
//true

      //TODO runway info
      //TODO trend
    } catch (e) {
      result.push('This data cannot be formatted as a METAR! because ' + e);
      throw new Error('This data cannot be formatted as a METAR!',{cause : e});
    }
  
    return result.join(' ') + ' <p>>>>' + logg.join('\n') + '</p>';
  }

  return (
    //<div>METAR AUTO {parsedMetar.meanWindSpeed_ms}</div>
    <div>{to_string()}</div> 
  )
};
function is_cccc (st:string) {
  return st.length === 4 && st.match('[A-Z]');
}

export default Metar;
