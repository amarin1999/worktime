// export interface Employee {
//   id: string;
//   firstname: string;
//   no: string;
//   lastname: string;
//   access?: string;
//   image?: string;
// }

export interface resultEmployee {
  result:       string;
  stringData:   null;
  data:         Employee[];
  errorMessage: null;
  code:         number;
}
export interface Employee {
  id:        string;
  firstname: string;
  no:        string;
  lastname:  string;
  accessReport?:    string;
  image?: string
}
