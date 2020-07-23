export interface OvertimeCalendar {
    id?: number;
    title?: string;
    timeRange?: [
        {
          startTime: Date;
          endTime: Date;
        }
      ];
    startTime?: Date;
    endTime?: Date;
    projectNo?: boolean;
    remark?: string;
    employeeNo?: string;
}
