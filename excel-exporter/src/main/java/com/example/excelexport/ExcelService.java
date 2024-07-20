package com.example.excelexport;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
public class ExcelService {

    public ByteArrayInputStream exportExcel(Map<String, String> vehicleInfo, List<Map<String, String>> data, String notes) throws IOException {
        String templatePath = "/eses.xlsx";  // Şablon dosyasının yolu
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (InputStream is = getClass().getResourceAsStream(templatePath);
             Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            // Araç bilgilerini doldurma
            sheet.getRow(1).getCell(1).setCellValue(vehicleInfo.get("Araç Plakası"));
            sheet.getRow(1).getCell(3).setCellValue(vehicleInfo.get("Araç Sahibi"));
            sheet.getRow(2).getCell(1).setCellValue(vehicleInfo.get("Marka/Model"));
            sheet.getRow(2).getCell(3).setCellValue(vehicleInfo.get("Adres"));
            sheet.getRow(3).getCell(1).setCellValue(vehicleInfo.get("Rengi"));
            sheet.getRow(3).getCell(3).setCellValue(vehicleInfo.get("KM"));
            sheet.getRow(4).getCell(1).setCellValue(vehicleInfo.get("Şasi No"));
            sheet.getRow(4).getCell(3).setCellValue(vehicleInfo.get("Tel"));
            sheet.getRow(5).getCell(1).setCellValue(vehicleInfo.get("Giriş Tarihi"));

            int startRow = 8; // Veri girişinin başlayacağı satır numarası (0'dan başlıyor)

            for (int i = 0; i < data.size(); i++) {
                Row row = sheet.createRow(startRow + i);
                Map<String, String> rowData = data.get(i);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(rowData.get("Miktar"));

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(rowData.get("Parça Adı"));

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(rowData.get("Birim Fiyatı"));

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(rowData.get("Fiyat"));
            }

            // Notlar kısmını ekleme
            Row notesRow = sheet.createRow(startRow + data.size() + 1);
            Cell notesCell = notesRow.createCell(0);
            notesCell.setCellValue("NOTLAR: " + notes);

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } finally {
            out.close();
        }
    }
}
