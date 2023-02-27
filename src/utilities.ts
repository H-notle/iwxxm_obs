export interface standardisedData{
  key: string;
  value: number;
  units: string;
  orig_key?:string;
  orig_units?: string;
  }  
  interface enumStandardisedData extends standardisedData {}

function convertUnits(fromUnits:string, toUnits:string, value:number ): number {
  let result = NaN;
  if (toUnits.toUpperCase() == 'KT') {
    if (fromUnits.toUpperCase() == 'MS') {
      result = value * 0.514444;
    } else if (fromUnits.toUpperCase() == 'MPH') {
      result = value * 2.23694;
    }
  }
  if (isNaN(result)){
    console.log(`convertUnits("${fromUnits}","${toUnits}",${value}) cannot be done`);
  }
  return result;
}
function convertFields(inData:[string:any]) : enumStandardisedData[] {
  const result : enumStandardisedData[] = [];
  for (const each in Object.keys(inData)) {
    const _bits = each.split('_');
    if (_bits.length > 1) {
      const units = _bits[-1];
      const Units = _bits[-1].toUpperCase();
      if (['KT','MPH'].includes(units) ){
        const value =  convertUnits(units,'MS',inData[each]);
        const newKey = each.replace(`_${units}`,'_MS');
        if (!isNaN(value)){
            const newconv: standardisedData = {key: newKey,value:value,units:'MS',orig_key:each,orig_units:units}
            result.push(newconv);
        } 
      }
       
    }
  } 
  return result;


}