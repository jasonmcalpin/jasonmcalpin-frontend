declare module 'toml-j0.4' {
  export interface TomlValue {
    [key: string]: TomlValue | string | number | boolean | Date | Array<TomlValue | string | number | boolean | Date>;
  }
  
  export function parse(text: string): TomlValue;
  export default { parse };
}
