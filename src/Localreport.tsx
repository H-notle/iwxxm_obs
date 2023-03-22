// import { ListClassKey, Table } from '@material-ui/core';
// import { blue } from '@material-ui/core/colors';
import React from 'react';

//import { forEachChild } from 'typescript';
import MetarFields, { CloudGroup } from './MetarFields';
import LocalreportDisplay from './LocalreportDisplay';

// interface ExtraNonMetarFields{
//   key: string;
//   value: any;
// }

interface MetarProps {
    metar: MetarFields;
    displayFormat:string;
    keywordInfo:string;
    selectedKeyword:string;
}

export interface LocalReportDisplayUnits{
  windSpeed : number;
  windSpeedUnits : string;
  //temperature : number;
  temperatureUnits : string;
  //visibility: number;
  visibilityUnits: string;
  pressure :number;
  pressureUnits :string;
  windSpeedDesc : string;
  windSpeedTerm: string;
  temperatureDesc : string;
  pressureDesc :string; 
  heightUnits:string;
  heightFtConversion:number;
}


export function celciusToFahrenheit(c:number) : number{
  return (c * 9.0)/5.0 + 32.0; 
}
export function celciusToKelvin(c:number):number{
  return c + 273.16;
}

export function lr_loadUnits(displayFormat:string): LocalReportDisplayUnits {
  // TODO watch C/C laugh when they see this...
  //console.log(`loadUnits displayFormat="${displayFormat}"`)
  var results: LocalReportDisplayUnits={
    windSpeed : 1.94384,
    windSpeedUnits:'',
    temperatureUnits : 'C',
    pressure : 1.0,
    //visibility: "";
    visibilityUnits: "", // Metres
    windSpeedDesc : 'wind speed is knots',
    windSpeedTerm : 'knots',
    temperatureDesc : 'temperature is Celcius',
    pressureUnits:'hPa',
    pressureDesc : 'pressure is HPa' ,
    heightUnits:'M',
    heightFtConversion:3.2808399
  }

  if (displayFormat === 'american') {
    console.log(`loadUnits changing units to be ="${displayFormat}"`)
    results = {
      
      windSpeed : 2.23694,
      windSpeedUnits:'MPH',
      temperatureUnits : 'F',//celciusToFahrenheit, // what do do here ... needs a function ...(t * 9/5)+32
      pressure : 1 / .338639, // hPa to inches of Hg - I think thats correct!!!
      windSpeedDesc : 'wind speed is MPH',
      windSpeedTerm : 'miles per hour',
      visibilityUnits: "SM", // Statute Miles
      temperatureDesc : 'temperature is Fahrenheit',
      pressureUnits : 'inHg',
      pressureDesc : 'pressure is inches of mercury',
      heightUnits:'FT',
      heightFtConversion:1
    
    }
       
  }  else if (displayFormat === 'international') {
    results ={
      windSpeed : 1.94384,
      windSpeedUnits : 'KT',
      temperatureUnits : 'C',//celciusToCelcius,
      pressure : 1.0,
      visibilityUnits: "", // Metres
      windSpeedDesc : 'wind speed is knots',
      windSpeedTerm : 'knots',
      temperatureDesc : 'temperature is Celcius',
      pressureUnits:'hPa',
      pressureDesc : 'pressure is hPa',
      heightUnits:'M',
      heightFtConversion:3.2808399
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
      windSpeedTerm : 'meters per second',
      temperatureDesc : 'temperature is not yet kelvin',
      pressureDesc : 'pressure is Pa',
      heightUnits:'M',
      heightFtConversion:3.2808399 
    }
  }  else if (displayFormat === 'nz') { //TODO don't show for NZ
    results ={
      windSpeed : 1.94384,
      windSpeedUnits : 'KT',
      temperatureUnits : 'C',//celciusToCelcius,
      pressure : 1.0,
      visibilityUnits: "", // Metres
      windSpeedDesc : 'wind speed is knots',
      windSpeedTerm : 'knots',
      temperatureDesc : 'temperature is Celcius',
      pressureUnits:'hPa',
      pressureDesc : 'pressure is hPa',    
      heightUnits:'M',
      heightFtConversion:3.2808399
    }
  } else if (displayFormat === 'european') {
    results ={
      windSpeed : 1,
      windSpeedUnits : 'MPS',
      temperatureUnits : 'C',//celciusToCelcius,
      pressure : 1.0,
      visibilityUnits: "", // Metres
      windSpeedDesc : 'wind speed is metres per second',
      windSpeedTerm : 'metres per second',
      temperatureDesc : 'temperature is Celcius',
      pressureUnits:'hPa',
      pressureDesc : 'pressure is hPa',    
      heightUnits:'M',
      heightFtConversion:3.2808399
    }
  }
  return results;
}  



export function icaoNumberStr(n:number,maxDigits:number,roundDown:boolean ){
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

export function checkWithin(n:string,minN:number,maxN:number): boolean {
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

export function validDayOfMonth(y:string,m:string,d:string):boolean{
  // validate y,m,d as a valid date ..  not millenium safe
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
        } else {
          daysInM=28;
        };
      }
      if ([4,6,9,11].includes(im)) {daysInM=30};
      //console.log(`validDayOfMonth(${y},${m},${d}) -> daysInM = ${daysInM}`)
      if (id <= daysInM) {result = true} ;
    }
  } catch {};
  return result;
} 

export function dirRoundTo10Deg(d:number) : number {
  return 10 * Math.round(d/10.0);
}

export function icaoNumberStr2orMore(n:number){// used for wind/gust where it is normally 2 chars long but can be 3
  let l= Math.min(Math.max(`${Math.round(n)}`.length,2),3);
  //console.log(`icaoNumberStr2orMore(${n}) -> l=${l}`);
  return icaoNumberStr(n,l,false);
}

export function ddd_to_compass8(ddd:number):string{
  // const dirStrings = {0:"Northerly",
  //                   45:"Northeasterly",
  //                   90:"Easterly",
  //                   135:"Southeastery",
  //                   180:"Southerly",
  //                   225:"Southwesterly",
  //                   270:"Westerly",
  //                   315:"Northwesterly"};
  const dirStrings = ["northerly",
                    "northeasterly",
                    "easterly",
                    "southeasterly",
                    "southerly",
                    "southwesterly",
                    "westerly",
                    "northwesterly",
                    "northerly"];
  if (!ddd){
    return '';
  }                  
  return dirStrings[Math.floor((ddd+22)/45)];
}


export function formatWind_plain(parsedMetar : MetarFields, setUnits:LocalReportDisplayUnits) {
  const result = [];
  try {
    if (parsedMetar["meanWindSpeed_ms"] ){
      result.push(icaoNumberStr2orMore(parsedMetar["meanWindSpeed_ms"]*setUnits['windSpeed'])); 
         
      // if (parsedMetar["gust_ms"]) {
      //   result.push(`G${icaoNumberStr2orMore(parsedMetar["gust_ms"]*setUnits['windSpeed'])}`);
      //   // strictly can be 3 digits...
      // }
    } else {
      result.push('?no wind?');
    }      
    result.push(setUnits['windSpeedTerm']);
  } catch (e) {
    result.push('?unknown wind?'); 
  }
  try {
    //const roundedTo10Deg = parsedMetar["meanWindDirection_Deg"]
    if (parsedMetar["meanWindSpeed_ms"] <= 3){ /// not sure these units are correct
      result.push('variable'); 
    } else if (parsedMetar["meanWindDirection_Deg"] > 360) {
      result.push('(no direction)');
    } else{
      var ddd10 = Math.round(parsedMetar["meanWindDirection_Deg"] / 10.0);
      if (ddd10 === 0) {
        ddd10 = 36;
      } 
      result.push(ddd_to_compass8(parsedMetar["meanWindDirection_Deg"])); 

    }

  } catch (e) {
    result.push('///');   
  }
  // no checking of wind cf gust values > 5 knots etc  (wait for colour highlighting...)

  // const windVarResult = [];

  if (parsedMetar["extremeCounterClockwiseWindDirection_Deg"]  || parsedMetar["extremeClockwiseWindDirection_Deg"]){
    result.push('and is swirling around a bit'); 
    const antiClock = ddd_to_compass8(parsedMetar["extremeCounterClockwiseWindDirection_Deg"]);
    const clock = ddd_to_compass8(parsedMetar["extremeClockwiseWindDirection_Deg"]);
    if (antiClock && clock){
      result.push(`${antiClock} to ${clock}`.replaceAll('erly',''));
    } else {
      result.push(`esp. to the ${antiClock}${clock}`.replace('erly',''));
    }
  } 
  return result.join(' ')+'.';
}


export function formatTimeDDHHMM(parsedMetar:MetarFields) {
  //date = parsedMetar['datetime'].split('-').join('').split('T').join('').split(':').join('')
  // brutal string chopping - avoids JS mucking around with locale 
  const dt = parsedMetar['datetime'].split('T');
  const date = dt[0];
  const time = dt[1].split(':');
  
  let dd = date.split('-')[2];
  let hh = time[0];
  let mm = time[1];
  let finaldd = '//';
  //const month = Number(date.split('-')[1]);
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







export function formatRecentWx(parsedMetar : MetarFields){
  let result = '';
  if (parsedMetar["recentWeather"]){
    result =  'RE'+parsedMetar["recentWeather"];
  }
  return result;
}

export function lr_formatTemp(tt : number, setUnits:LocalReportDisplayUnits){
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

export function formatTemps(parsedMetar : MetarFields, setUnits:LocalReportDisplayUnits){
  const tt = parsedMetar["airTemperature_C"];
  const td = parsedMetar["dewpointTemperature_C"];
  const result = [];
  result.push(lr_formatTemp(tt,setUnits));
  result.push('/');
  result.push(lr_formatTemp(td,setUnits));
  if (!['','C'].includes(setUnits['temperatureUnits'])) {
    result.push(setUnits['temperatureUnits']);
  }
  return result.join('');
} 

export function formatPressure(parsedMetar : MetarFields, setUnits:LocalReportDisplayUnits) {
  /*for scientific ...maybe  MSLP*/
  const result = [];
  //console.log(` formatPressure WS=${parsedMetar["qnh_hPa"]} out units= ${setUnits['pressureUnits']}`);
  if (setUnits['pressureUnits'] === 'inHg'){
    result.push('A');
  } else{
    result.push('Q');
  }
//TODO  if < 950 or > 1050 (check the rules) ...prob should be //// 
  try {
    var p = parsedMetar['qnh_hPa'];
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

export function formatRunwayState(parsedMetar : MetarFields){
  const result = [];
  if (parsedMetar['runwayInfo']){
    result.push(`${parsedMetar['runwayInfo']['runwayCode']}`);
    result.push(`${parsedMetar['runwayInfo']['wxCode1']}`);
    result.push(`${parsedMetar['runwayInfo']['wxCode2']}`);
    result.push(`${parsedMetar['runwayInfo']['runwayState']}`);
  }
  return result.join('');
}



export function is_cccc (st:string) {
  return st.length === 4 && st.match('[A-Z]');
}


export function text_date_time(parsedMetar:MetarFields):string{
  const dt = parsedMetar['datetime'].split('T');
  //const date = dt[0];
  const time = dt[1].split(':');
  let result = 'sometime';
  try{
    //let dd = date.split('-')[2];
    let hh = Number(time[0]);
    let mm = Number(time[1]);
    let ampm = 'am';
    if (hh >= 12) {
      ampm = 'pm';
    }
    if (hh > 12){
      hh = hh - 12;
    } else if (hh === 0){
      hh = 12;
    }
    if (mm === 0){
      result = hh+ampm;
    } else {
      result = hh + ":" + mm + ampm;      
    }
  } catch {}
  return result;
}

function localreport_to_string(parsedMetar: MetarFields, setUnits:LocalReportDisplayUnits, displayFormat:string){
  const result = [];
  //const logg = ['Notes'];
  try {
    let MorS = '';
    if (parsedMetar['flags'].includes('SPECIAL')) {
      MorS = "SPECIAL" // SPECI trumps METAR... TODO should there be checks as to whether the report fits SPECI criteria?
    } else if (parsedMetar['flags'].includes('METAR')) {
      MorS = "MET REPORT";
    }
    if (MorS !==  ''){
      if (displayFormat === 'scientific'){
        result.push('(notReallyA)MET REPORT');
      } else {
        result.push(MorS);
      }
      // if (parsedMetar['flags'].includes('CORRECTION')){
      //   result.push('COR'); // TODO does COR trump Auto???
      // } else if (parsedMetar['flags'].includes('AUTO')){
      //   result.push('AUTO');
      // }
    } else {
      result.push('<pseudoMETREP>');
    }

    // if (!is_cccc(parsedMetar['station'] )) {
    //   throw new Error(`The station ("${parsedMetar['station']}") contains other chars than A-Z so cannot be a valid METAR station code `)
    // }
    // result.push(parsedMetar['station']);
    // //result.push('<b> '+parsedMetar['station']+' </b>');
    // result.push(formatTimeDDHHMM(parsedMetar)); // strictly  MM should be mm=00/30 for METAR
    // //result.push(lr_formatWind(parsedMetar,setUnits));
    // // 



    // // if (isCAVOK(parsedMetar) && displayFormat !== 'nz') {
    // //   result.push('CAVOK');
    // // } else {
    //   result.push(formatViz(parsedMetar, setUnits, displayFormat));
      
    //   result.push(formatPresentWx(parsedMetar));

    //   result.push(formatClouds(parsedMetar));
    // // }
    result.push(formatTemps(parsedMetar,setUnits));
    result.push(formatRecentWx(parsedMetar));
    //15.13.3 wind shear TODO..
    //       WS RDRDR or  WS ALL RWY
    // Information on the existence of wind shear along the take-off path or approach path 
    // between one runway level and 500 metres (1 600 ft) significant to aircraft operations 
    // shall be reported whenever available and if local circumstances so warrant, using the 
    // group set WS RDRDR repeated as necessary. If the wind shear along the take-off path or 
    // approach path is affecting all runways in the airport, WS ALL RWY shall be used.
    //TODO 15.13.5 Sea-surface temperature and the state of the sea (WTsTs/SS') or sea-surface temperature
    // and the significant wave height (WTsTs/HHsHsHs)
    result.push(formatPressure(parsedMetar, setUnits));
    result.push(formatRunwayState(parsedMetar));

    if (parsedMetar['remarks']) {
      result.push('RMK');
      result.push(parsedMetar['remarks'].toUpperCase());
    }

    //TODO runway info
    //TODO trend
  } catch (e) {
    result.push('This data cannot be formatted as a METAR! because ' + e);
    //throw new Error('This data cannot be formatted as a METAR!',{cause : e});
  }

  return result.join(' ')+'=';
}

function addMinutes(pDate:Date, minutes:number) {
  return new Date(pDate.getTime() + minutes*60000);
}

function averageTimeSeries(uglyAs:string,earliest:Date,latest:Date,minReports:number):number{
  const a = JSON.parse(uglyAs);
  let result = NaN;
  let sum = 0.0;
  //const keys = Object.keys(a);
  let obCount = 0;
  const earliestT = earliest.getTime();  
  const latestT = latest.getTime();
  //console.log(`averageTimeSeries earliestT =${earliestT}, latestT=${latestT}`);
  for (const dtString in a){
    try {
      const thisDT = new Date(dtString);    
      const obT = thisDT.getTime(); 
      //console.log(`averageTimeSeries this obT =${obT}`);
      if (earliestT <= obT && obT <= latestT && !Number.isNaN(a[dtString])){
        sum = sum + Number(a[dtString]);
        //console.log(`averageTimeSeries found ${obCount+1} at ${dtString}, adding ${a[dtString]}  to sum=${sum}`);
        obCount = obCount + 1;
      } else{
        console.log(`averageTimeSeries  ${dtString} is the wrong time`);
      }
    } catch (e){
      console.log(`averageArray  exception summing data for ${dtString} val was >${a[dtString]}<  "${e}"`);
    }
  }
  //console.log(`averageTimeSeries found ${obCount} relevant reports, sum=${sum}`);
  if (obCount >= minReports){
    result = sum/obCount;
  }
  //console.log(`averageTimeSeries average (${sum} /  ${obCount}) = ${result}`);
  return result;
}

function load1minuteWind(parsedMetar: MetarFields) : number {
  // overly simple... doesn't check that there is a minute between the obs
  let result = NaN;
  const extraKeys = Object.keys(parsedMetar.extras);
  const obTime = parsedMetar.datetime;
  const latestTime = new Date(obTime);
  const earliestTime = addMinutes(latestTime,-10);  

  try{
    if (extraKeys.includes('windSpeed1min_ms')){
      //console.log(`load1minuteWind trying to use 1min data`);
      // I can't work out how to cleanly pass this data into the averaging method & unpacking it without typescript getting all confused...
      const uglyAs = JSON.stringify(parsedMetar.extras['windSpeed1min_ms']);
      result = averageTimeSeries(uglyAs,earliestTime,latestTime,10);
    } 
    if (Number.isNaN(result)) {
      if (extraKeys.includes('windSpeed30sec_ms')){
        //console.log(`load1minuteWind trying to use 30sec data`);
        const uglyAs = JSON.stringify(parsedMetar.extras['windSpeed30sec_ms']);
        result = averageTimeSeries(uglyAs,earliestTime,latestTime,20);
      } else {
        console.log(`load1minuteWind no other wind fields found in ${extraKeys}`);
      }
    }

  } catch (e){
    console.log(`load1minuteWind error ${e}`)
  }
  return result;
}

const LocalReport: React.FC<MetarProps> = ({ metar,displayFormat,keywordInfo,selectedKeyword }) => {
  //const [val, setValidJson] = React.useState(true);
  var parsedMetar = metar;   
  const setUnits = lr_loadUnits(displayFormat);
  const lKeywordInfo = JSON.parse(keywordInfo);   
  if (!parsedMetar.meanWindSpeed_ms){
    //console.log('Metar calling load1minuteWind');
    parsedMetar.meanWindSpeed_ms = load1minuteWind(parsedMetar); 
    //console.log(`Metar called load1minuteWind wind speed=${parsedMetar.meanWindSpeed_ms}`);
  }
  const keyPhrases = lKeywordInfo[selectedKeyword];
  const tac= localreport_to_string(parsedMetar, setUnits, displayFormat);

  return (  
    <>
    <div >
      <LocalreportDisplay parsedMetar={parsedMetar} displayFormat= {displayFormat} keywordInfo={keywordInfo} selectedKeyword={selectedKeyword}/>
    </div>      
   </>
  )
};



export default LocalReport;
