import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

interface acTypesProps{
    aircraftNames : string[];
    //chosenType : string;
    onChange:(chosenType:string) => void;
    }
  
  const SelectAircraftType: React.FC<acTypesProps> = ({ aircraftNames, onChange }) => {
  //https://www.npmjs.com/package/react-dropdown change not working
  const defaultOption = 'ToDo';
  onChange(defaultOption);
    return  (    
      <>
      Select Aircraft Type:
        <div>
        {/* <input type="drop-down" value={Object.map(aircraftNames)} /> */}
{/* <Dropdown options={aircraftNames}  onChange={this._onSelect} value={defaultOption}  /> */}
<Dropdown options={aircraftNames}  value={defaultOption}  />
        </div>
        
      </>
    );
  }
  
  export default SelectAircraftType;