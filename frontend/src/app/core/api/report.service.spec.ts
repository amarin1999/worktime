import { defaultReportName, filenameFromContentDisposition } from './report.service';

describe('report file names', () => {
  it('reads a quoted filename', () => {
    expect(filenameFromContentDisposition('attachment; filename="worktimeExcel202611.xlsx"')).toBe(
      'worktimeExcel202611.xlsx',
    );
  });

  it('reads an unquoted filename', () => {
    expect(filenameFromContentDisposition('attachment; filename=add-workanywhere-202611.dat')).toBe(
      'add-workanywhere-202611.dat',
    );
  });

  it('prefers the RFC 5987 filename* form', () => {
    expect(
      filenameFromContentDisposition(
        "attachment; filename=\"leave.xlsx\"; filename*=UTF-8''%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%99.xlsx",
      ),
    ).toBe('รายงาน.xlsx');
  });

  it('returns null without a header', () => {
    expect(filenameFromContentDisposition(null)).toBeNull();
    expect(filenameFromContentDisposition('inline')).toBeNull();
  });

  it('has sensible fallback names', () => {
    expect(defaultReportName('time-attendance', 2026, 3)).toBe('add-workanywhere-202603.dat');
    expect(defaultReportName('worktime', 2026, 11)).toBe('worktimeExcel202611.xlsx');
  });
});
