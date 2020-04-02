export interface OvertimeWork {
  id?: number;
  timeRange:
    | [
        {
          startTime: Date;
          endTime: Date;
        }
      ]
    | {};
  projectNo: boolean;
  remark: string;
  employeeNo?: string;
}
