import MetarFields, { METAR_FIELD_KEYS } from "./MetarFields";


export function parseMyMetarFunction(textValue: string):MetarFields {
    try {
      const rawJson = JSON.parse(textValue);
      const extras = loadExtraData(rawJson);
      const result =  {...rawJson}; 
      result.extras = [];
      //   for (const each in extras){
      extras.forEach((extra, i) => {
        const k = extra.key;
        const v = extra.value;
        result.extras[k] = v;
        //console.log(`parseMyMetarFunction loaded extra key:"${k}" : val: "${v}"`);
    });
      return result;
    }catch (e) {
       throw Error('Error loading json', {cause:e}); 
    }  
  }

function loadExtraData(j:Record<string,any>){
  //const j = JSON.parse(textValue);
  const result = []; //new Array();
 
  for (const each in j){
    
    if (METAR_FIELD_KEYS.includes(each)){
      //console.log(`getloadExtraData have key "${each}" is a METAR field`);
    } else{
      //console.log(`getloadExtraData have key "${each}" is NOT a METAR field`);
      result.push({"key":each,"value":j[each]});
    }
  }
  return result; 
}