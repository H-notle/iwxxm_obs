import React from 'react';

interface acProps{
    acType: string;
    //fields: number| string;
    fields: Record<string, string | number| boolean>
}
    
const showAircraftProperties: React.FC<acProps> = ({ acType ,fields} )=> {
    const myContents = fields; //JSON.stringify(fields[acType], null, 2));
    let borderColor = "black";
    let backgroundColor = "white";
    let asString = String(fields);
    return (
      <textarea rows={4} cols={25}
        value={asString}
        style = {{borderColor,backgroundColor}}  
      >
        Aircraft "{acType}":
        {
        Object.keys(fields).map((each) => {
          return (
            <tr key={each}>
             <td>{each} </td> 
             <td>{fields[each]}</td> 
            </tr>) 
        })
       }
        </textarea> 
    );
}

export default showAircraftProperties;