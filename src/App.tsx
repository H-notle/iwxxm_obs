import React from 'react';
import Metar from './Metar';
import ExtraData from './Metar';
import defaultIwxxmData from './here_is_some_data.json';
import JSONMetar from './load_data'
import './App.css';
import MetarEditor from './MetarEditor';
import MetarFields from './MetarFields';
import { parseMyMetarFunction } from './ParseMetar';



function App() {

  const [iwxxmObs, setIwxxmObs] = React.useState(JSON.stringify(defaultIwxxmData, null, 2));
  const [metar, setMetar] = React.useState<MetarFields>();
  const [validJson, setValidJson] = React.useState(true);
 
  //const [jsonObs, setJsonObs] = React.useState('TODO');

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
  return (
    
    <div className="App">
      <p>Here is some data to play with:</p>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>stuff here1</div>
        <MetarEditor rawData={iwxxmObs} validJson={validJson} onChange={setIwxxmObs} />
        <div>stuff here2</div>
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
  
      {metar && <Metar metar={metar} displayFormat={displayFormat} />}


      <p> TODO show errors/exceptions......)</p>
      <p> TODO add TREND data......</p>
      <p> colouring fields......</p>
      <p> adding a/c...... then ...</p>
      <p> map?!!!... multiple obs</p>
      <p>alternative views ...meteorogram</p>
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
