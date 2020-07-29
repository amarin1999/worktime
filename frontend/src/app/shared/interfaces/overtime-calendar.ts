export interface OvertimeCalendar {
    id?: number;
    title?: string;
    timeRange?: [
        {
          start: Date;
          end: Date;
        }
      ];
    startTime?: Date;
    endTime?: Date;
    projectNo?: string;
    remark?: string;
    employeeNo?: string;
}
