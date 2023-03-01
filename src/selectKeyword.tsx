import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
//import { AircraftInfo } from './MetarFields';
//import showAircraftProperties from './showAircraftProperties';

interface acTypesProps{
    keywords : string;
    chosenKeyword : string;
    onChange:(chosenKeyword:string) => void;
    }
  
const SelectKeyword: React.FC<acTypesProps> = ({ keywords, chosenKeyword, onChange }) => {
  //https://www.npmjs.com/package/react-dropdown change not working
  //to do align these down the page , flex-direction: column
  const lKeywordInfo =  JSON.parse(keywords);
  const keys = Object.keys(lKeywordInfo);

  return  (    
    <>
      <div style={{ display: 'flex', flexDirection:'row', justifyContent: 'space-around'}}> 
        Select Keyword :               
        <Dropdown
            options={keys}
            onChange={(option) => onChange(option.value)}
            value={chosenKeyword}
        />
      </div> 
      <div >
         {Object.keys(lKeywordInfo[chosenKeyword]).map((each) => {
          return (
            <tr key={each}>
             {/* <td>{each} </td>  */}
             <td>{lKeywordInfo[chosenKeyword][each]}</td> 
            </tr>) 
          }
        )}
      </div> 
    </>
  );
}
  
  export default SelectKeyword;