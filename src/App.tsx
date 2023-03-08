import React from 'react';
import Metar from './Metar';
//import ExtraData from './Metar';
import defaultIwxxmData from './here_is_some_data.json';
import aircraftTypes from './aircraftTypes.json';
import runwayInfoStr from './runwayInfo.json'; 
import keywords from './keywords.json';

//import JSONMetar from './load_data'
import './App.css';
import MetarEditor from './MetarEditor';
import MetarFields from './MetarFields';
import { parseMyMetarFunction } from './ParseMetar';
//import AircraftPicker from './AircraftPicker';
import SelectAircraftType from './SelectAircraftType'; 
import SelectKeyword from './selectKeyword'; 

import showAircraftProperties from './showAircraftProperties';
import SelectRunway from './landing';

function App() {
  // for (const each in Object.keys(keywords)){
  //   keywords[each].push(each);
  // } 
  const initialAC = 'None' ;
  const initalRW  = 'None';
  const [iwxxmObs, setIwxxmObs] = React.useState(JSON.stringify(defaultIwxxmData, null, 2));
  const [metar, setMetar] = React.useState<MetarFields>();
  const [validJson, setValidJson] = React.useState(true);
  const [chosenType, setAircraftType] = React.useState(initialAC);
  const [chosenRunway, setRunway] = React.useState(initalRW);
  const [selectedKeyword, setKeyword] = React.useState('none');
  //const [jsonObs, setJsonObs] = React.useState('TODO');
  console.log('loaded defaultIwxxmData');
  const [displayFormat,setFormat] = React.useState('international');
  React.useEffect(() => {
    try { 
      const parsedMetar = parseMyMetarFunction(iwxxmObs);
      setMetar(parsedMetar);
      setValidJson(true);
    } catch{
      setValidJson(false);
    }
  },[iwxxmObs])
  const aircraftNames = Object.keys(aircraftTypes)
  return (
    
    <div className="App">
      <p>Here is some data to play with:</p>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ display: 'flex', flexDirection:'column',  justifyContent: 'space-around'}}> 
          
         <SelectAircraftType aircraftTypes={JSON.stringify(aircraftTypes,null,2)} aircraftNames={aircraftNames} aircraftType={chosenType} onChange={setAircraftType} />
         <br/>(aircraft data not used yet)
         <br/>
         <SelectKeyword keywords={JSON.stringify(keywords,null,2)} chosenKeyword={selectedKeyword} onChange={setKeyword} />
      
        </div>

        {/* <MetarEditor rawData={iwxxmObs} validJson={validJson} onChange={setIwxxmObs} /> */}

        <MetarEditor rawData={iwxxmObs} validJson={validJson}  onChange={setIwxxmObs} />

<div>

          <SelectRunway  runwayInfoStr= {JSON.stringify(runwayInfoStr,null,2)} chosenRunway = {chosenRunway} onChange={setRunway} />

        </div>
      </div>

      
       <p></p>
            <input type="radio" value="international" id="international" 
            checked = {displayFormat === 'international'}
              onChange={()=> setFormat('international')} name="displayFormat" />
            <label>International</label> 

            <input type="radio" value="american" id="american"
              onChange={()=> setFormat('american')} name="displayFormat"/>
            <label>pseudo-american</label>  

            <input type="radio" value="scientific" id="scientific"
              onChange={()=> setFormat('scientific')} name="displayFormat"/>
            <label>scientific</label>  
            <input type="radio" value="nz" id="nz"
              onChange={()=> setFormat('nz')} name="displayFormat"/>
            <label>NZ</label>  
            <input type="radio" value="european" id="european"
              onChange={()=> setFormat('european')} name="displayFormat"/>
            <label>European</label>    
      {metar && <Metar metar={metar} displayFormat={displayFormat} keywordInfo={JSON.stringify(keywords,null,2)} selectedKeyword={selectedKeyword}/>}

      {/* <p>ac type={chosenType}</p> */}
      {/*<p> TODO show errors/exceptions......)</p>
      <p> TODO add TREND data......</p>
      <p> colouring fields......</p>
      <p> adding a/c...... then ...</p>
      <p> map?!!!... multiple obs</p>
      <p>alternative views ...meteorogram</p> */}
      {/* <textarea 
        onChange={(event) => {
          setJsonObs(event.target.value);
          //Metar.editableData(event.target.value);
        }}
        value={jsonObs}
      /> */}
    </div>
  );
}//style={color:'red'}  // "kiwicount"=12,  14
//style="color:#FF0000"
export default App;
