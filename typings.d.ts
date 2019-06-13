declare module '*.css';
declare module "*.png";
declare module '*.less';
declare module "*.json" {
  const value: any;
  export const version: string;
  export default value;
 }
