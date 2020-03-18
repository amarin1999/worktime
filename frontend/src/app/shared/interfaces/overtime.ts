export interface OvertimeWork {
  timeRange: [
    {
      startTime: Date;
      endTime: Date;
    }
  ];
  projectNo: boolean;
  remark: string;
  employeeNo?: string;
}
