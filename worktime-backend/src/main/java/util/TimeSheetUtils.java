package util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class TimeSheetUtils {
	private static String EMP_FORMAT = "000000";
	private static int BEGIN_NEWDATE = 5; //5.00 am
	private static String BEGIN_NEWDATE_FORMAT_TIME = "5.00 น.";
	public static final Locale LOCALE_TH = new Locale("th", "TH");
	public static final String EMP_TYPE = "I";
	public static final String INDOOR_CODE = "FL15";
	public static final String OUTDOOR_CODE = "FL15";

	public static final SimpleDateFormat dateFormat_TH = new SimpleDateFormat("dd/MM/yyyy", LOCALE_TH);
	public static final SimpleDateFormat monthFormat_TH = new SimpleDateFormat("MM/yyyy", LOCALE_TH);
	public static final SimpleDateFormat dateTimeFormat_TH = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss", LOCALE_TH);
	public static final SimpleDateFormat TimeFormatHHMM = new SimpleDateFormat("HH.mm");
	public static final SimpleDateFormat dateFormatyyyy_MM_ddEnglish = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
	
	private static final String BLANK = "";
	
	public static Date tranferToSmallDateTime(Date date) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(date);
		calendar.set(Calendar.MILLISECOND, 0);
		calendar.set(Calendar.SECOND, 0);
//		calendar.add(Calendar.MINUTE, 1);
		return calendar.getTime();
	}

	public static Date getBeginDate(Date date) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(date);
		calendar.set(Calendar.MILLISECOND, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.HOUR, 0);
		calendar.add(Calendar.DATE, -1);
		calendar.set(Calendar.HOUR_OF_DAY, 24);
		return calendar.getTime();
	}

	public static Date getBeginTimeOfDay(Date date) {

		Calendar cal = Calendar.getInstance(TimeSheetUtils.LOCALE_TH);
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, BEGIN_NEWDATE);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		return cal.getTime();
	}

	public static Date getNextDay(Date date) {

		Calendar cal = Calendar.getInstance(TimeSheetUtils.LOCALE_TH);
		cal.setTime(date);
		cal.add(Calendar.DATE, 1);
		return cal.getTime();
	}

	public static String formatEmpNo(String empNo) {
		if(empNo.length() < 6){
			empNo = EMP_FORMAT.substring(empNo.length()) + empNo;
		}
		if (empNo.startsWith("9")){
			empNo = empNo.replaceFirst("9", "C");
		}
		return empNo;
	}

	public static String splitEmpNo(String valueStr){
		if (!"".equals(valueStr)) {
			StringBuilder result = new StringBuilder();
			String[] splitedText = valueStr.split(",");
			for (String splited : splitedText) {
				if (result.toString().length() > 0) {
					result.append(",");
				}
				result.append(TimeSheetUtils.formatEmpNo(splited));
			}
			return result.toString();
		}
		return valueStr;
	}
	public static Boolean isSameDate(Date date, Date compareDate) {

//		if(getBeginDate(date).compareTo(getBeginDate(compareDate)) == 0) {
//			return true;
//		} else {
//			if(isBeforeNewDate(compareDate)) {
//				Calendar cal = Calendar.getInstance(TimeSheetUitls.LOCALE_TH);
//				cal.setTime(date);
//				cal.add(Calendar.DATE, -1);
//				Date previousDate = cal.getTime();
//				if(getBeginDate(date).compareTo(getBeginDate(previousDate)) == 0) {
//					return true;
//				}
//			}
//		}
//		return false;
		return getBeginDate(date).compareTo(getBeginDate(compareDate)) == 0;
	}

	public static boolean isBeforeNewDate(String time) {
		String hourValue = time.substring(0, 2);
		int hour = Integer.parseInt(hourValue);
		if(hour < BEGIN_NEWDATE) {
			return true;
		}
		return false;
	}

	public static boolean isBeforeNewDate(Date date) {
		Date beginTime = getBeginTimeOfDay(date);
		if(date.compareTo(beginTime) == -1) {
			return true;
		}
		return false;
	}

	public static Boolean isAfterNewDate(Date date) {

//		boolean result = isBeforeNewDate(date);
//		return !result;
		int inTimeHour = getHour(date);
		return inTimeHour >= BEGIN_NEWDATE;
	}

	public static int getHour(Date date) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 24);
		return calendar.get(Calendar.HOUR);
	}

	public static Date getDateBeginOfLastMonth(Date currentDate) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(currentDate);
		calendar.set(Calendar.DATE, 1);
		calendar.add(Calendar.MONTH, -1);
		calendar.set(Calendar.MILLISECOND, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		Date date = calendar.getTime();
		return date;
	}

	public static Date getDateBeginOfMonth(Date currentDate) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(currentDate);
		calendar.set(Calendar.DATE, 1);
		calendar.set(Calendar.MILLISECOND, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		Date date = calendar.getTime();
		return date;
	}

	public static Date getDateEndOfMonth(Date currentDate) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(currentDate);
		
		calendar.add(Calendar.MONTH, 1);
		
		calendar.set(Calendar.DATE, 1);
		calendar.add(Calendar.DATE, -1);
		calendar.set(Calendar.MILLISECOND, 0);
		calendar.set(Calendar.SECOND, 59);
		calendar.set(Calendar.MINUTE, 59);
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		Date date = calendar.getTime();
		return date;
	}

	public static Date getDateBeginOfMonth(String value) {
		Date beginDate = null;
		try{
			Date date = monthFormat_TH.parse(value);
			Calendar calendar = Calendar.getInstance(LOCALE_TH);
			calendar.setTime(date);
			int month = calendar.get(Calendar.MONTH);
			int year = calendar.get(Calendar.YEAR);
			beginDate = getDateBeginOfMonth(month, year);
		}catch(ParseException e){
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return beginDate;
	}
	
	public static Date getDateBeginOfMonth(int month, int year) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.set(Calendar.YEAR, year);
		calendar.set(Calendar.MONTH, month);
		calendar.set(Calendar.DATE, 1);
		calendar.set(Calendar.MILLISECOND, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		Date date = calendar.getTime();
		return date;
	}

	public static Date getDateEndOfMonth(int month, int year) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.set(Calendar.YEAR, year);
		calendar.set(Calendar.MONTH, month);
		calendar.add(Calendar.MONTH, 1);
		
		calendar.set(Calendar.DATE, 1);
		calendar.add(Calendar.DATE, -1);
		calendar.set(Calendar.MILLISECOND, 0);
		calendar.set(Calendar.SECOND, 59);
		calendar.set(Calendar.MINUTE, 59);
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		Date date = calendar.getTime();
		return date;
	}
	
	public static Date getDateEndOfLastMonth(Date currentDate) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(currentDate);
		calendar.set(Calendar.DATE, 1);
		calendar.add(Calendar.DATE, -1);
		calendar.set(Calendar.MILLISECOND, 0);
		calendar.set(Calendar.SECOND, 59);
		calendar.set(Calendar.MINUTE, 59);
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		Date date = calendar.getTime();
		return date;
	}

	public static int getDayOfMonth(Date date) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(date);
		return calendar.getActualMaximum(Calendar.DAY_OF_MONTH);

	}

	public static int getLastMonth(Date date) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(date);
		calendar.add(Calendar.MONTH, -1);
		int month = calendar.get(Calendar.MONTH);
		return month;
	}

	public static String getMonthFormatMM(Date date) {

		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(date);
		int month = calendar.get(Calendar.MONTH);
		month++;
		String value = String.valueOf(month);
		if(month < 10) {
			value = String.valueOf(month);
			value = "0" + value;
		}
		return value;
	}

	//วนเก็บเดือนให้อยู่ในรูปDate[] เพื่อเช็คเดือนที่มีวัน 30หรือ31
	public static Date[] getDateOfMonths(Date date) {

		Date[] dates = new Date[32];
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(date);

		int day = 1;
		int endLoopDay = calendar.getActualMaximum(Calendar.DAY_OF_MONTH) + 1;
		for(int i = day; i < endLoopDay; i++){
			calendar.set(Calendar.DATE, i);
			dates[i] = calendar.getTime();
		}

		return dates;
	}
	//ใช้เติม 0 ข้างหน้าของวัน เช่น 01
	public static String getDateFormatDD(Date date) {
		SimpleDateFormat formatDD = new SimpleDateFormat("dd", TimeSheetUtils.LOCALE_TH);
		String value = formatDD.format(date);
		return value;
	}

	//ใช้เติม 0 ข้างหน้าของวัน เพื่อไว้ใช้ mapกับRow เช่นRowที่แสดงวันที่แรกอยู่ที่Row 2 ก็จะมาmapกับ 01 , Row 3 ก็จะmapกับ02 ไปเรื่อยๆ ตามลำดับ
	public static Map<String, Integer> getDayIndexs() {

		Map<String, Integer> days = new HashMap<String, Integer>();
		for(int i = 1; i < 32; i++){
			String day = String.valueOf(i);
			if(i < 10) {
				day = "0" + day;
			}
			days.put(day, null);
		}
		return days;
	}

	public static String getBeginNewDateFormatTime() {
		return BEGIN_NEWDATE_FORMAT_TIME;
	}

	public static Date getPreviousDate(Date date) {
		Calendar calendar = Calendar.getInstance(LOCALE_TH);
		calendar.setTime(date);
		calendar.add(Calendar.DATE, -1);
		calendar.set(Calendar.MILLISECOND, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.HOUR, 0);
		date = calendar.getTime();
		return date;
	}
	
	public static String formatDateToEnglishDate_dd_MM_yyyy(Date inputDate) {
		if(inputDate != null) {
			
			SimpleDateFormat dateFormatyyyy_MM_ddEnglishClone = (SimpleDateFormat)dateFormatyyyy_MM_ddEnglish.clone();
			return dateFormatyyyy_MM_ddEnglishClone.format(inputDate);
			
		}
		return BLANK;
	}
	
	public static Date parseTextToDateFormat_TH(String inputDate) {

			SimpleDateFormat dateFormat_THClone = (SimpleDateFormat)dateFormat_TH.clone();
			
			try {
				
				return dateFormat_THClone.parse(inputDate);
				
			} catch (ParseException e) {
				
				return null;
				
			}
			
	}
}
