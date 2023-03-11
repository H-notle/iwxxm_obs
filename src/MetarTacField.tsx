import React from 'react';
//import {Text} from '@adobe/react-spectrum'

//import { forEachChild } from 'typescript';
import MetarFields, { CloudGroup } from './MetarFields';

// interface ExtraNonMetarFields{
//   key: string;
//   value: any;
// }

interface MetarTacFieldProps {
  // metar: MetarFields;
  // displayFormat:string;
  // keywordInfo:string;
  // selectedKeyword:string;
  tacField:string;
  styling:string;
  elementName:string;
}

function displayDetailsMouseOver(s:string,flags:[string]):string{
  let result = '';
  console.log(`displayDetailsMouseOver(${s},${flags} called`);
  if (s==='CAVOK'){
    result = 'CAVOK is reportable when there is no cloud below 5000ft, No CB/TS/TSU, visibilty is > 9999M and no present weather reported';
  } 
return result;
}
const MetarTacField: React.FC<MetarTacFieldProps> = ({tacField,styling,elementName}) =>{//metar,displayFormat,keywordInfo,selectedKeyword }) => {
  //let myObject=<span style="color: red;">apple</span>;
  //console.log(`MetarTacField (called with ${elementName})`);
  if (styling &&  styling === '<b>') {
    let inRed = '';
    //let inRed = <span style="color: red;">red</span>;

    return (  
        <div ><b>{inRed}{tacField}{inRed}</b></div>
        )     
     
  } else{
    //style={{ display: 'flex', font-size: '12px'}}
    return (  
      <div style={{ display: 'flex',height:'40px'}}>
        {tacField}
        </div>
    )
 }
}

export default MetarTacField;