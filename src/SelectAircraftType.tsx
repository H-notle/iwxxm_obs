import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { AircraftInfo } from './MetarFields';
//import showAircraftProperties from './showAircraftProperties';

interface acTypesProps{
    aircraftTypes : string;// AircraftInfo[];
    aircraftNames : string[];
    aircraftType : string;
    onChange:(chosenType:string) => void;
    }
  
const SelectAircraftType: React.FC<acTypesProps> = ({ aircraftTypes, aircraftNames, aircraftType, onChange }) => {
  //https://www.npmjs.com/package/react-dropdown change not working
  //to do align these down the page , flex-direction: column
  const lAircraft =  JSON.parse(aircraftTypes);
  //console.log(`SelectAircraftType aircraftTypes=${aircraftTypes}`);
  const thisACInfo = lAircraft[aircraftType];
  //console.log(`SelectAircraftType thisA/C=${JSON.stringify(thisACInfo,null,2)}`);
  return  (    
    <>
      <div style={{ display: 'flex', flexDirection:'row', justifyContent: 'space-around'}}>  
      Select Aircraft Type:
        
          {/* <input type="drop-down" value={Object.map(aircraftNames)} /> */}
          {/* <Dropdown options={aircraftNames}  onChange={this._onSelect} value={defaultOption}  /> */}
      <Dropdown
        options={aircraftNames}
        onChange={(option) => onChange(option.value)}
        value={aircraftType}
      />
       
      </div> 
      <div >
         {/* {JSON.stringify(thisACInfo, null, 2)} */}
         {Object.keys(thisACInfo).map((each) => {
          return (
            <tr key={each}>
             <td>{each} </td> 
             <td>{thisACInfo[each]}</td> 
            </tr>) 
          }
        )}
      </div> 
    </>
  );
}
  
  export default SelectAircraftType;