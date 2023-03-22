export function celciusToFahrenheit(c:number) : number{
  return (c * 9.0)/5.0 + 32.0; 
}
export function celciusToKelvin(c:number):number{
  return c + 273.16;
}
export function feetToMetres(ft:number): number{
  return ft * 3.2808399;
}
export function feetToMetresRoundedDown(ft:number): number{
  return Math.floor(feetToMetres(ft)/100)*100;
}
export function valueRoundedDownto100s(n:number): number{
  return Math.floor(n/100)*100;
}
