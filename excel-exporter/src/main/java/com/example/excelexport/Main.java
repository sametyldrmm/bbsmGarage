package com.example.excelexport;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        String templatePath = "/eses.xlsx";  // Şablon dosyasının yolu
        String outputPath = "output.xlsx";   // Çıkış dosyasının yolu

        // Araç bilgileri
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

        // Fake JSON verisi
        List<Map<String, String>> data = new ArrayList<>();

        for (int i = 1; i <= 60; i++) {
            Map<String, String> row = new HashMap<>();
            row.put("Miktar", String.valueOf(i));
            row.put("Parça Adı", "Parça " + i);
            row.put("Birim Fiyatı", String.valueOf(i * 10)); // Tamsayı olarak ayarla
            row.put("Fiyat", String.valueOf(i * 10)); // Tamsayı olarak ayarla
            data.add(row);
        }

        // Notlar kısmı
        String notes = "Bu kısma notlar eklenir. Uzun metinler olabilir ve notlar kısmında satır satır gösterilir.";

        try {
            ExcelUtil.fillExcelTemplate(templatePath, outputPath, vehicleInfo, data, notes);
            System.out.println("Excel dosyası başarıyla oluşturuldu: " + outputPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
