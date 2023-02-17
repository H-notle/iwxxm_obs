import React from 'react';

interface Props{
  rawData:string;
  validJson: boolean; 
  onChange:(newRawData:string) => void;
}

const MetarEditor: React.FC<Props> = ({ rawData, validJson, onChange }) => {
  //const parsedMetar = parseMyMetarFunction(iwxxmObs);
  let borderColor = "black";
  let backgroundColor = "white";
  if (!validJson){
    borderColor = "red";
    backgroundColor = "lightpink";
  }
  return  (     
  <textarea rows={24} cols={60}
    onChange={(event) => onChange(event.target.value)} 
    value={rawData}
    style = {{borderColor,backgroundColor}}  
  />);

} ;
export default MetarEditor;
