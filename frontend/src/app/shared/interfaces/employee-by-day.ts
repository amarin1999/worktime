
export interface EmployeeByDay {
    result?: null;
    stringData?: null;
    data?: (DataEntity)[] | null;
    errorMessage?: null;
    code: number;
}
export interface DataEntity {
    lastname: string;
    firstname: string;
    employeeNo: string;
    workAnywhere: number;
}

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}


