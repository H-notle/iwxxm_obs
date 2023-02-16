import React from 'react';
import Metar from './Metar';
import ExtraData from './Metar';
import defaultIwxxmData from './here_is_some_data.json';
import JSONMetar from './load_data'
import './App.css';



function App() {

  const [iwxxmObs, setIwxxmObs] = React.useState(JSON.stringify(defaultIwxxmData, null, 2));

  const [jsonObs, setJsonObs] = React.useState('TODO');

  const [displayFormat,setFormat] = React.useState('international');

  return (
    
    <div className="App">
      <p>Here is some data to play with:</p>
      <textarea rows={24} cols={60}
        onChange={(event) => {
          setIwxxmObs(event.target.value);
        }}
        value={iwxxmObs}
      />
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
  
      <Metar iwxxmObs={iwxxmObs} displayFormat={displayFormat} />
      {/* <ExtraData iwxxmObs={iwxxmObs} displayFormat={displayFormat}/> */}
      {/* <ExtraData iwxxmObs={iwxxmObs} /> */}
      <p>Extra Data:             </p>
      <table  align={"center"}  onChange={() => {}}
        id = "extra-data-table"
      />       

      {/* <p> TODO get radio button working.....</p> */}
      <p> TODO fix showing extra stuff......</p>
      <p> TODO show errors/exceptions......(stop crashing/highlight when json feed data is invalid)</p>
      <p> TODO add TREND data......</p>
      <p> colouring fields......</p>
      <p> adding a/c...... then ...</p>
      <p> map?!!!... multiple obs</p>
      <p>alternative views ...meteorogram</p>
      <textarea 
        onChange={(event) => {
          setJsonObs(event.target.value);
          //Metar.editableData(event.target.value);
        }}
        value={jsonObs}
      />
    </div>
  );
}//style={color:'red'}  // "kiwicount"=12,  14
//style="color:#FF0000"
export default App;
