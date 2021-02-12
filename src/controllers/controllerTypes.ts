export interface CustomError {
  name: string;
  messages?: any;
  // {
  //   errors: Array<{value: string, msg: string, param: string, location?: string}>
  // };
  status: number;
}
