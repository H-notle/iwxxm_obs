interface MetarFields  {
    datetime : string;
    station : string;
    flags: string []; //('AUTO' | "WOOZLE" | 'METAR')[]; 
    meanWindDirection_Deg: number;
    meanWindSpeed_ms: number;
    gust_ms: number;
    extremeClockwiseWindDirection_Deg: number;
    extremeCounterClockwiseWindDirection_Deg: number;
    //TODO runway specific viz
    prevailingVisibility_m: number;
    presentWeather:string;  //TODO only one allowed right now
    cloudGroups: CloudGroup [];
    airTemperature_C: number;
    dewpointTemperature_C: number;
    qnh_hPa: number;
    recentWeather:PresentWeather;
    runwayInfo:RunwayInfo;
    remarks: string;
    trend: string;
    extras: Record<string, string | number| boolean|Array<any>>;//|Array<Timeseries>>;
  }
export interface CloudGroup {
  cloudKey : ('SCT' | 'FEW' | 'BKN' | 'OVC' | 'NSC' | 'NCD' | 'NSC');// []; 
  flightLevel : number; // TODO prob should be optional 
  cloudType: ('' | 'TCU' | 'CB' | 'NSC' | 'NCD' | 'NSC'); //TODO prob should be optional 
  // what about SKC & NCD
  }
export interface PresentWeather{ 
  code:string;
  locational:string;
  intensity:string;
  }
export interface RunwayInfo{
  runwayCode : string;
  wxCode1 : number;
  wxCode2 : number;
  runwayState : number;
}
export interface Timeseries{
  dt: string; // iso-date
  value :number
}


export interface AircraftInfo{
  crosswindMax: number;    
  minimumPressure_hPa : number;  
  maximumPressure_hPa : number;  
  maxheadwind :number;  
  }

export interface RunwayInfo {
  orientation_deg : number;
  length_m : number;
  height_ft: number;
  }
export interface StandardisedData{
  key: string;
  value: number;
  units: string; //['hPa','m','ft',]
  }

export const METAR_FIELD_KEYS=  [ //(keyof MetarFields)[] = 
    "datetime",
    "station",
    "flags",
    "meanWindDirection_Deg",
    "meanWindSpeed_ms",
    "gust_ms",
    "extremeClockwiseWindDirection_Deg",
    "extremeCounterClockwiseWindDirection_Deg",
    "prevailingVisibility_m",
    "presentWeather", 
    "recentWeather",
    "cloudGroups",
    "airTemperature_C",
    "dewpointTemperature_C",
    "qnh_hPa",
    "runwayInfo",
    "remarks",
    "trend"
  ];
  export default  MetarFields;