import React from 'react';
import Metar from './Metar';
import defaultIwxxmData from './here_is_some_data.json';
import JSONMetar from './load_data'
import './App.css';


function App() {
  //hbe var displayFormat= 'international';

  const [iwxxmObs, setIwxxmObs] = React.useState(JSON.stringify(defaultIwxxmData, null, 2));
  //const strjson = JSON.stringify(defaultIwxxmData, null, 2);

  //const [jsonObs, setJsonObs] = React.useState(JSON.stringify(JSONMetar, null, 2));
  const [jsonObs, setJsonObs] = React.useState(JSONMetar.toString());

  const [displayFormat,setFormat] = React.useState('international');

  console.log('isUS',displayFormat);
  //const cannedMetar= new Metar;
  //displayFormat = format;
  return (
    
    <div className="App">
      <p>Some structured obs:</p>
      <textarea
        onChange={(event) => {
          setIwxxmObs(event.target.value);
          //displayFormat = handleChange.target.value
        }}
        value={iwxxmObs}
      />
       <p></p>
            <input type="radio" value="international" id="international"
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
      
      {/* <p> TODO get radio button working.....</p> */}
      <p> TODO get box below showing extra stuff......</p>
      <p> TODO show errors/exceptions......</p>
      <p> colouring fields......</p>
      <p> adding a/c...... then ...</p>
      <p> map!!!... multi obs</p>
      <textarea 
        onChange={(event) => {
          setJsonObs(event.target.value);
          //Metar.editableData(event.target.value);
        }}
        value={jsonObs}
      />
    </div>
  );
}

export default App;
