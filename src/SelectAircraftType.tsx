import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
//import showAircraftProperties from './showAircraftProperties';

interface acTypesProps{
    aircraftNames : string[];
    //chosenType : string;
    onChange:(chosenType:string) => void;
    }
  
const SelectAircraftType: React.FC<acTypesProps> = ({ aircraftNames, onChange }) => {
  //https://www.npmjs.com/package/react-dropdown change not working
  const defaultOption = 'ToDo';
  onChange(defaultOption);
  //to do align these down the page , flex-direction: column 
  return  (    
    <>
      <div> 
      Select Aircraft Type:
          
          {/* <input type="drop-down" value={Object.map(aircraftNames)} /> */}
          {/* <Dropdown options={aircraftNames}  onChange={this._onSelect} value={defaultOption}  /> */}
      <Dropdown options={aircraftNames}  value={defaultOption} />
      
      </div>  
    </>
  );
}
  
  export default SelectAircraftType;