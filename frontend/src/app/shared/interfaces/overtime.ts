export interface OvertimeWork {
  id?: number;
  timeRange?: [
    {
      start: Date;
      end: Date;
    }
  ];
  startTime?: Date;
  endTime?: Date;
  idProject?: string;
  remark: string;
  employeeNo?: string;
  type?: string;
}
