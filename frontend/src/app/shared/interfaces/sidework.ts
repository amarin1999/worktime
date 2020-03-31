export interface SideWork {
  id?: number;
  day: Date;
  startTime: Date;
  endTime: Date;
  workAnyWhere?: boolean;
  remark: string;
  employeeNo?: string;
  type?: string;
}
