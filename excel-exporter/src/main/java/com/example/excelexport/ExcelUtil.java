package com.example.excelexport;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

public class ExcelUtil {

    private static final int ROWS_PER_PAGE = 23;

    public static void fillExcelTemplate(String templatePath, String outputPath, Map<String, String> vehicleInfo, List<Map<String, String>> data, String notes) throws IOException {
        try (InputStream is = ExcelUtil.class.getResourceAsStream(templatePath);
             Workbook workbook = new XSSFWorkbook(is)) {

            int sheetIndex = 0;
            int rowIndex = 9;
            Sheet sheet = workbook.getSheetAt(sheetIndex);

            // Para birimi hücre stilini oluşturma
            CellStyle financialCellStyle = workbook.createCellStyle();
            DataFormat format = workbook.createDataFormat();
            financialCellStyle.setDataFormat(format.getFormat("#,##0.00 ₺"));  // Para birimi olarak ₺ (Türk Lirası)

            // Araç bilgilerini ve başlıkları doldurma
            fillHeaderAndVehicleInfo(sheet, vehicleInfo);

            for (int i = 0; i < data.size(); i++) {
                if (rowIndex >= ROWS_PER_PAGE + 9) {  // 9 header rows + 23 data rows per page
                    rowIndex = 9;
                    sheetIndex++;
                    sheet = copySheet(workbook, workbook.getSheetAt(0), "Page " + (sheetIndex + 1));
                    fillHeaderAndVehicleInfo(sheet, vehicleInfo);
                }
                Row row = sheet.createRow(rowIndex++);
                Map<String, String> rowData = data.get(i);

                fillCell(row, 0, rowData.get("Miktar"));
                fillCell(row, 1, rowData.get("Parça Adı"));
                fillCellNumeric(row, 2, Double.parseDouble(rowData.get("Birim Fiyatı")), financialCellStyle);
                fillCellNumeric(row, 3, Double.parseDouble(rowData.get("Fiyat")), financialCellStyle);
            }

            // Notlar kısmını ekleme
            addNotes(sheet, notes);

            try (FileOutputStream fos = new FileOutputStream(outputPath)) {
                workbook.write(fos);
                System.out.println("Dosya başarıyla yazıldı: " + outputPath);
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }
    }

    private static void fillHeaderAndVehicleInfo(Sheet sheet, Map<String, String> vehicleInfo) {
        // Araç bilgilerini doldurma
        fillCell(sheet, 2, 1, vehicleInfo.get("Araç Plakası"));
        fillCell(sheet, 2, 3, vehicleInfo.get("Araç Sahibi"));
        fillCell(sheet, 3, 1, vehicleInfo.get("Marka/Model"));
        fillCell(sheet, 3, 3, vehicleInfo.get("Adres") + "\n\n");
        fillCell(sheet, 4, 1, vehicleInfo.get("Rengi"));
        fillCell(sheet, 5, 3, vehicleInfo.get("KM"));
        fillCell(sheet, 5, 1, vehicleInfo.get("Şasi No"));
        fillCell(sheet, 6, 3, vehicleInfo.get("Tel"));
        fillCell(sheet, 6, 1, vehicleInfo.get("Giriş Tarihi"));

        // Başlık satırlarını doldurma
        Row headerRow = sheet.getRow(9);
        if (headerRow == null) {
            headerRow = sheet.createRow(9);
        }
        fillCell(headerRow, 0, "MİKTAR");
        fillCell(headerRow, 1, "PARÇA ADI");
        fillCell(headerRow, 2, "BİRİM FİYAT");
        fillCell(headerRow, 3, "FİYAT");
    }

    private static void fillCell(Sheet sheet, int rowIndex, int cellIndex, String value) {
        Row row = sheet.getRow(rowIndex);
        if (row == null) {
            row = sheet.createRow(rowIndex);
        }
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            cell = row.createCell(cellIndex);
        }
        cell.setCellValue(value);
    }

    private static void fillCell(Row row, int cellIndex, String value) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            cell = row.createCell(cellIndex);
        }
        cell.setCellValue(value);
    }

    private static void fillCellNumeric(Row row, int cellIndex, double value, CellStyle style) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            cell = row.createCell(cellIndex);
        }
        cell.setCellValue(value);
        cell.setCellStyle(style); // Hücre stilini ayarla
    }

    private static Sheet copySheet(Workbook workbook, Sheet originalSheet, String newSheetName) {
        Sheet newSheet = workbook.createSheet(newSheetName);
        copySheetContent(workbook, originalSheet, newSheet);
        return newSheet;
    }

    private static void copySheetContent(Workbook workbook, Sheet originalSheet, Sheet newSheet) {
        for (int i = 0; i <= originalSheet.getLastRowNum(); i++) {
            Row oldRow = originalSheet.getRow(i);
            Row newRow = newSheet.createRow(i);
            if (oldRow != null) {
                newRow.setHeight(oldRow.getHeight());
                for (int j = 0; j < oldRow.getLastCellNum(); j++) {
                    Cell oldCell = oldRow.getCell(j);
                    Cell newCell = newRow.createCell(j);
                    if (oldCell != null) {
                        copyCellStyle(workbook, oldCell, newCell);
                    }
                }
            }
        }

        // Copy merged regions
        for (int i = 0; i < originalSheet.getNumMergedRegions(); i++) {
            newSheet.addMergedRegion(originalSheet.getMergedRegion(i));
        }

        // Copy column widths
        for (int i = 0; i < originalSheet.getRow(0).getLastCellNum(); i++) {
            newSheet.setColumnWidth(i, originalSheet.getColumnWidth(i));
        }
    }

    private static void copyCellStyle(Workbook workbook, Cell oldCell, Cell newCell) {
        CellStyle newCellStyle = workbook.createCellStyle();
        newCellStyle.cloneStyleFrom(oldCell.getCellStyle());
        newCell.setCellStyle(newCellStyle);
        switch (oldCell.getCellType()) {
            case STRING:
                newCell.setCellValue(oldCell.getStringCellValue());
                break;
            case NUMERIC:
                newCell.setCellValue(oldCell.getNumericCellValue());
                break;
            case BOOLEAN:
                newCell.setCellValue(oldCell.getBooleanCellValue());
                break;
            case FORMULA:
                newCell.setCellFormula(oldCell.getCellFormula());
                break;
            default:
                break;
        }
    }

    private static void addNotes(Sheet sheet, String notes) {
        int notesRowIndex = sheet.getLastRowNum() + 1;
        Row notesRow = sheet.createRow(notesRowIndex);
        Cell notesCell = notesRow.createCell(0);
        notesCell.setCellValue("NOTLAR");

        notesRow = sheet.createRow(notesRowIndex + 1);
        notesCell = notesRow.createCell(0);
        notesCell.setCellValue(notes);

        // Gerekirse hücre stillerini ve hücre birleşimlerini ayarlayabilirsiniz
        sheet.addMergedRegion(new CellRangeAddress(notesRowIndex + 1, notesRowIndex + 1, 0, 3));
    }
}
