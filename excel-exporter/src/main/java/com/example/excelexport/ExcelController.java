package com.example.excelexport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/excel")
public class ExcelController {

    @Autowired
    private ExcelService excelService;

    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> downloadExcel() throws IOException {
        Map<String, String> vehicleInfo = new HashMap<>();
        vehicleInfo.put("Araç Plakası", "34ABC123");
        vehicleInfo.put("Marka/Model", "Ford Focus");
        vehicleInfo.put("Rengi", "Mavi");
        vehicleInfo.put("Şasi No", "1FADP3F26JL123456");
        vehicleInfo.put("Giriş Tarihi", "20.07.2024");
        vehicleInfo.put("Araç Sahibi", "Ahmet Yılmaz");
        vehicleInfo.put("Adres", "İstanbul");
        vehicleInfo.put("KM", "120000");
        vehicleInfo.put("Tel", "05051234567");

        List<Map<String, String>> data = new ArrayList<>();
        Map<String, String> row1 = new HashMap<>();
        row1.put("Miktar", "1");
        row1.put("Parça Adı", "Motor Yağı");
        row1.put("Birim Fiyatı", "50.00");
        row1.put("Fiyat", "50.00");

        Map<String, String> row2 = new HashMap<>();
        row2.put("Miktar", "2");
        row2.put("Parça Adı", "Hava Filtresi");
        row2.put("Birim Fiyatı", "25.00");
        row2.put("Fiyat", "50.00");

        data.add(row1);
        data.add(row2);

        ByteArrayInputStream in = excelService.exportExcel(vehicleInfo, data);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=output.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}
