import React from 'react';
import { json } from 'stream/consumers';
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
  value:string|Number|boolean|Object;
}
interface KeyPieces {
  originalName:string;
  pieces:string[];
  units: string;
  value?:Number|string|boolean|any;
}
const KNOWN_UNITS = ['M','hPa','C','ms','Deg'];

function splitKeyIntoUnits <KeyPieces>(s:string,value:any){
  const pieces = s.split('_');
  let units = '';
  const words = [];
  console.log(`splitKeyIntoUnits pieces=${pieces}`);
  if (pieces.length > 1){
    const possUnits = pieces[pieces.length-1];
    console.log(`splitKeyIntoUnits possUnits=${possUnits}`);
    if (KNOWN_UNITS.includes(possUnits)){
      units= possUnits;
    }
  }
  for (const each in pieces){
    if (pieces[each] === units) {
      words.push(pieces[each]);
    } else {
      const thisBunch = pieces[each].replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z][0-9])/g, " $1").split(' ');  
      for (const bun in thisBunch){
        if (thisBunch[bun] !== ''){
          words.push(thisBunch[bun].toLowerCase());
        }
      }
    }
  }
  return {originalName:s,
    pieces: words, // might need them
    units:units,
    value:value
  };
}


function displayDetailsMouseOver(s:string,originalFieldKey:string):string{
  let result = '';
  let flags='unionJack';
  console.log(`displayDetailsMouseOver(${s},${flags} called`);
  const keyBits = originalFieldKey.split('_');
  if (s==='CAVOK'){
    result = 'CAVOK is reportable when there is no cloud below 5000ft, No CB/TS/TSU, visibilty is > 9999M and no present weather reported';
  } else if (keyBits.length > 1 && ['hPa','C'].includes(keyBits[-1]))  {
    const maybeUnits = keyBits[keyBits.length-1].toLowerCase();
    if (maybeUnits === 'hpa'){
      //const resultList = [];
      //resultList.append('TODO')
    }
    
  }  
return result;
}
const MetarTacField: React.FC<MetarTacFieldProps> = ({tacField,styling,elementName,value}) =>{//metar,displayFormat,keywordInfo,selectedKeyword }) => {
  //let myObject=<span style="color: red;">apple</span>;
  //console.log(`MetarTacField (called with ${elementName})`);
  let allInfo = null;
  if (elementName) {
    //allInfo = splitKeyIntoUnits('AnotherLittleBrown_kiwi_fromNZ_C',99);
    allInfo = splitKeyIntoUnits(elementName,value);
    console.log(`MetarTacField given "${elementName}" split into allInfo: [pieces:${allInfo.pieces}  units:${allInfo.units}]`);
}
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