package com.cdgs.worktime.controller;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ColorController {

	XSSFWorkbook workbook = new XSSFWorkbook();
	
	
	public  CellStyle  ColorRedController() {
		// Sunday style
		CellStyle colorRED = workbook.createCellStyle();
		colorRED.setFillForegroundColor(IndexedColors.RED.getIndex());
		colorRED.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		return colorRED;
	}
}
