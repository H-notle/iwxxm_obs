import { ListClassKey, Table } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import React from 'react';

import { forEachChild } from 'typescript';
import MetarFields, { CloudGroup } from './MetarFields';


interface ExtraNonMetarFields{
  key: string;
  value: any;
}

interface Props {
    metar: MetarFields;
    displayFormat:string;
}

interface DisplayUnits{
  windSpeed : number;
  windSpeedUnits : string;
  //temperature : number;
  temperatureUnits : string;
  //visibility: number;
  visibilityUnits: string;
  pressure :number;
  pressureUnits :string;
  windSpeedDesc : string;
  temperatureDesc : string;
  pressureDesc :string; 
}


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
    //visibility: "";
    visibilityUnits: "", // Metres
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
      visibilityUnits: "SM", // Statute Miles
      temperatureDesc : 'temperature is Fahrenheit',
      pressureUnits : 'inHg',
      pressureDesc : 'pressure is inches of mercury' 
    }
       
  }  else if (displayFormat === 'international') {
    results ={
      windSpeed : 1.94384,
      windSpeedUnits : 'KT',
      temperatureUnits : 'C',//celciusToCelcius,
      pressure : 1.0,
      visibilityUnits: "", // Metres
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
      visibilityUnits: "", // Metres
      pressureUnits:'Pa',
      windSpeedDesc : 'wind speed is who knows',
      temperatureDesc : 'temperature is not yet kelvin',
      pressureDesc : 'pressure is Pa' 
    }
  }  else if (displayFormat === 'nz') {
    results ={
      windSpeed : 1.94384,
      windSpeedUnits : 'KT',
      temperatureUnits : 'C',//celciusToCelcius,
      pressure : 1.0,
      visibilityUnits: "", // Metres
      windSpeedDesc : 'wind speed is knots',
      temperatureDesc : 'temperature is Celcius',
      pressureUnits:'hPa',
      pressureDesc : 'pressure is hPa' 
    }
  }
  return results;
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


function checkWithin(n:string,minN:number,maxN:number): boolean {
  let result = false;
  if ([1,2].includes(n.length)) {
    try {
      const intN = parseInt(n); 
      if (intN >= minN && intN <= maxN){
        result = true;
      }
    }catch {}
  }
  return result;
}
function validDayOfMonth(y:string,m:string,d:string):boolean{
  //
  let result = false;
  try{
    const iy = Number(y);

    const im = Number(m);
    const id = Number(d);
    if (im >= 1 && im <= 12){
      let daysInM = 31; 
      if (im === 2){
        if (Math.floor(iy /100.0) * 100.0 === iy){ // bugger the millenium rule
          daysInM=28

        } else if (Math.floor(iy /4.0) * 4.0 === iy){ 
          daysInM=29
        } else{
          daysInM=28;
        };
      }
      if ([4,6,9,11].includes(im)) {daysInM=30};
      console.log(`validDayOfMonth(${y},${m},${d}) -> daysInM = ${daysInM}`)
      if (id <= daysInM) {result = true} ;
    }
  } catch {};
  return result;
} 
const Metar: React.FC<Props> = ({ metar,displayFormat }) => {
  var parsedMetar = metar;   
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
    let finaldd = '//';
    const month = Number(date.split('-')[1]);
    if (validDayOfMonth(date.split('-')[0],date.split('-')[1],dd)) { //MONTHS[month])){       
      finaldd = dd;
      if (finaldd.length === 1) {finaldd= '0'+finaldd} ;
    } else{
      // prob should invalidate the whole date time field  
    }
    
    let finalhh = '//';
    if (checkWithin(hh,0,23)){
      finalhh = hh;
      if (finalhh.length === 1) {finalhh= '0'+finalhh} ;
    }
    let finalmm = '//';
    if (checkWithin(mm,0,59)){
      finalmm = mm;
      if (finalmm.length === 1) {finalmm= '0'+finalmm} ;
    }


    return finaldd+finalhh+finalmm;
  }

  function dirRoundTo10Deg(d:number) : number {
    return 10 * Math.round(d/10.0);
  }

  function icaoNumberStr2orMore(n:number){// used for wind/gust where it is normally 2 chars long but can be 3
    let l= Math.min(Math.max(`${Math.round(n)}`.length,2),3);
    console.log(`icaoNumberStr2orMore(${n}) -> l=${l}`)
    return icaoNumberStr(n,l,false);
  }

  function formatWind() {
    const result = [];
    try {
      //const roundedTo10Deg = parsedMetar["meanWindDirection_Deg"]
      if (parsedMetar["meanWindSpeed_ms"] <= 3){ /// not sure these units are correct
        result.push('VRB'); 
      } else if (parsedMetar["meanWindDirection_Deg"] > 360) {
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
    // no checking of wind cf gust values > 5 knots etc  (wait for colour highlighting...)
    try {
      if (parsedMetar["meanWindSpeed_ms"] ){
        result.push(icaoNumberStr2orMore(parsedMetar["meanWindSpeed_ms"]*setUnits['windSpeed']));    
      if (parsedMetar["gust_ms"]) {
        result.push(`G${icaoNumberStr2orMore(parsedMetar["gust_ms"]*setUnits['windSpeed'])}`);
        // strictly can be 3 digits...
      }
      result.push(setUnits['windSpeedUnits']);
    }
    } catch (e) {
      result.push('//'); 
    }
    const windVarResult = [];

    if (parsedMetar["extremeCounterClockwiseWindDirection_Deg"]){
      windVarResult.push(icaoNumberStr(dirRoundTo10Deg(parsedMetar["extremeCounterClockwiseWindDirection_Deg"]),3,false));
    } else {
      windVarResult.push('///');
    }

    windVarResult.push('V');

      if (parsedMetar["extremeClockwiseWindDirection_Deg"]){
      windVarResult.push(icaoNumberStr(dirRoundTo10Deg(parsedMetar["extremeClockwiseWindDirection_Deg"]),3,false));
    } else {
      windVarResult.push('///');  
    }

    const sWindVar = windVarResult.join('');
    if (sWindVar !== '///V///') {
      result.push(` ${sWindVar}`);
    } 
    return result.join('');
  }

  function formatViz() {
    let result = '////';
    if (setUnits['visibilityUnits'] === 'SM'){
      if (parsedMetar["prevailingVisibility_m"]){
        const sm = parsedMetar["prevailingVisibility_m"] * 0.000621371192
        if (sm < 0.50) {
          result = '1/4SM';
        } else if (sm < 0.75) {
          result = '1/2SM';
        } else if (sm < 1.0) {
          result = '3/4SM';
        } else if (sm > 15.0) {
          result = '15SM';
        } else {
          result = `${Math.floor(sm)}SM`;
        }
      }
    } else {
    try {
      if (displayFormat === 'nz' && parsedMetar["prevailingVisibility_m"] > 9999) {
        result = `${Math.round(parsedMetar["prevailingVisibility_m"]/1000)}KM`;
      } else{
        let vvvv = Number(parsedMetar["prevailingVisibility_m"]);
        if (vvvv >= 9999) {
          vvvv = 9999;
        } else if (vvvv < 1000) {
          vvvv = Math.floor(vvvv/100) * 100;
        } else{  
          vvvv = Math.floor(vvvv/1000) * 1000;
        }
        result = String(vvvv).padStart(4,"0");
      }
    } catch (e) {}
  }
    return result
  }
  function formatPresentWx(){
    if (parsedMetar["presentWeather"]){
      return parsedMetar["presentWeather"]
    }
  }
  function formatRecentWx(){
    if (parsedMetar["recentWeather"]){
      return parsedMetar["recentWeather"]
    }
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

    } catch(e) {
      result.push('///////');
    }
    return result.join('');    
  }
  function formatClouds(){
    // TODO validate clouds are in ascending order and increasing octas ...
    // TODO doesn't check if only 1 is CB/TCU
    const result = [];
    try {
      if (parsedMetar["cloudGroups"].length === 0) {
        return 'SKC' // prob not strictly correct... NCD etc
     }
     if (parsedMetar["cloudGroups"].length === 1 && parsedMetar["cloudGroups"][0]['cloudKey'] === 'NSC') {
      return 'NSC' 
     } // should prob. error if there is another cloud group along with NSC
     if (parsedMetar["cloudGroups"].length > 3) {
          console.log('what to do with more than 3 cloud groups..... sod it (can\'t show them all! ');
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
  function formatPressure() {
  /*for scientific ...maybe  MSLP*/
    const result = [];
    console.log(` formatPressure WS=${parsedMetar["qnh_hPa"]} out units= ${setUnits['pressureUnits']}`)
    if (setUnits['pressureUnits'] === 'inHg'){
      result.push('A');
    } else{
      result.push('Q');
    }
//TODO  if < 950 or > 1050 (check the rules) ...prob should be //// 
    try{
      var p = parsedMetar['qnh_hPa']
      if (!p){//(Number.isNaN(p)){
        result.push('////'); 
      } else{
        result.push(icaoNumberStr(Math.floor(parsedMetar['qnh_hPa'] * setUnits['pressure']),4,true)); // P3 true = round down
      }
  } catch(e){
        result.push('////');
    }
    return result.join('');
  }

  function formatRunwayState(){
    const result = [];
    result.push(`${parsedMetar['runwayInfo']['runwayCode']}`);
    result.push(`${parsedMetar['runwayInfo']['wxCode1']}`);
    result.push(`${parsedMetar['runwayInfo']['wxCode2']}`);
    result.push(`${parsedMetar['runwayInfo']['runwayState']}`);
    return result.join('');
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
       result.push(icaoNumberStr(t,maxdigits,false));
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

  function isCAVOK():boolean {
    var result = true;
    for (const each of parsedMetar["cloudGroups"]){
      if (each['flightLevel'] < 50) {
        result = false;
      } else if (each['cloudType'] === 'TCU') {
        result = false;
      } else if (each['cloudType'] === 'CB') {
        result = false;
      } else if (parsedMetar['presentWeather'] && parsedMetar['presentWeather'].indexOf('TS') >= 0){
        result = false; // this prob correct....
      }
    }
    if (result && parsedMetar['prevailingVisibility_m'] < 9999){
      result = false;
    }
    //TODO more once trends are added
    return result;
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
          //TODO decide any logic to do with SPECI is it relevant any more 
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
      result.push(formatTimeDDHHMM()); // strictly  MM should be mm=00/30 for METAR
      result.push(formatWind());
      // 
      if (isCAVOK() && displayFormat !== 'nz') {
        result.push('CAVOK');
      } else{
        result.push(formatViz());
        result.push(formatPresentWx());

        result.push(formatClouds());
      }
      result.push(formatTemps());
      result.push(formatRecentWx());
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
      //throw new Error('This data cannot be formatted as a METAR!',{cause : e});
    }
  
    return result.join(' ') ;
  }

  return (
  
    <>
      <div >

        {to_string()}
   
      {/* <p/>{getExtraHTML()}<p/> */}
      {/* {extraTable}  */}
    </div>
    <div>
      <br/>
      <b>Extra data:</b>
      <table  align={"center"}   
        id = "extra-data-table" 
      > 
       {
        Object.keys(metar.extras).map((each) => {
          return (
            <tr key={each}>
             <td>{each} </td> 
             <td>{metar.extras[each]}</td> 
            </tr>) 
        })
       }
      </table>
    </div>
   </>
  )
};
function is_cccc (st:string) {
  return st.length === 4 && st.match('[A-Z]');
}

export default Metar;
