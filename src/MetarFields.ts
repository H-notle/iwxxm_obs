interface MetarFields  {
    datetime : string;
    station : string;
    flags: string []; //('AUTO' | "WOOZLE" | 'METAR')[]; 
    meanWindDirection_Deg: number;
    meanWindSpeed_ms: number;
    gust_ms: number;
    extremeClockwiseWindDirection_Deg: number;
    extremeCounterClockwiseWindDirection_Deg: number;
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
    extras: Record<string, string | number| boolean>;
  }
  export interface CloudGroup {
    cloudKey : ('SCT' | 'FEW' | 'BKN' | 'OVC' | 'NSC');// [];
    flightLevel : number;
    cloudType: ('' | 'TCU' | 'CB');
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