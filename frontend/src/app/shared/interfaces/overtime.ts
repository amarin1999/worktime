export interface OvertimeWork {
  id?: number;
  timeRange?: [
    {
      startTime: Date;
      endTime: Date;
    }
  ];
  startTime?: Date;
  endTime?: Date;
  idProject?: string;
  projectNo?: boolean;
  remark: string;
  employeeNo?: string;
  employeehasId?: number;
  type?: string;
}
