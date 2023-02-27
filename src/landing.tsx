import React from 'react';
import MetarFields, { AircraftInfo, RunwayInfo } from './MetarFields';
import Dropdown from 'react-dropdown';

interface runwayInfoProps{
  runwayInfoStr : string; //RunwayInfo;// AircraftInfo[];
  chosenRunway : string;
  onChange:(chosenRunway:string) => void;
  }

// interface standardisedDataProps{
//   key: string;
//   value: number;
//   units: string;
// }
// const result = new Array();

const SelectRunway:  React.FC<runwayInfoProps> = ({ runwayInfoStr, chosenRunway, onChange }) => {
  const runwayInfo =  JSON.parse(runwayInfoStr);
  //console.log(`SelectAircraftType aircraftTypes=${aircraftTypes}`);
  const thisRunwayInfo = runwayInfo[chosenRunway];
  const runwayNames = Object.keys(runwayInfo)//runwayInfo.keys; //<runwayInfo className="keys"></runwayInfo>
  console.log(`SelectRunway(...) this Runway=${JSON.stringify(thisRunwayInfo,null,2)}`);
  // const standardisedData = Array(standardisedDataProps)
  return  (    
    <>
      <div > 
      Select Runway:
        
          {/* <input type="drop-down" value={Object.map(aircraftNames)} /> */}
          {/* <Dropdown options={aircraftNames}  onChange={this._onSelect} value={defaultOption}  /> */}
      <Dropdown
        options={runwayNames}
        onChange={(option) => onChange(option.value)}
        value={chosenRunway}
      />
       
      </div> 
      {/* <div>Runway :{chosenRunway}</div> */}
      <div >
         {/* {JSON.stringify(thisRunwayInfo, null, 2)} */}
        {Object.keys(runwayInfo[chosenRunway]).map((each) => {
          return (
            <tr key={each}>
             <td>{each} </td> 
             <td>{runwayInfo[chosenRunway][each]}</td> 
            </tr>) 
          }
        )}
          <br/>|
          <br/>|
          <br/>V<br/>
          (this data not used anywhere yet)
      </div> 
    </>
  );
}
  

function degreesToRadians(d:number):number {
  return (d % 360) * (Math.PI / 180);
}
function isTailwind(aircraft_deg:number, wind_deg:number): boolean{
  const angle_deg = 180 - Math.abs(Math.abs(aircraft_deg - wind_deg) - 180); 
  const angle_rad = degreesToRadians(angle_deg);
  return angle_rad > Math.PI/2.0;
}

function crosswindComponent_ms(angle_of_runway_deg:number,ddd_deg: number, ff_ms:number):number{
  let result= NaN;
  try{
    const angle_deg = 180 - Math.abs(Math.abs(angle_of_runway_deg - ddd_deg) - 180); 
    const angle_rad = degreesToRadians(angle_deg);
    result = Math.abs(Math.sin(angle_rad) * ff_ms);
  }catch{    
  }
  return result;
}

export default SelectRunway;