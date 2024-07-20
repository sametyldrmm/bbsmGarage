package com.example.excelexport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/excel")
public class ExcelController {

    @Autowired
    private ExcelService excelService;

    @PostMapping("/download")
    public ResponseEntity<InputStreamResource> downloadExcel(@RequestBody Map<String, Object> requestData) throws IOException {
        Map<String, String> vehicleInfo = (Map<String, String>) requestData.get("vehicleInfo");
        List<Map<String, String>> data = (List<Map<String, String>>) requestData.get("data");
        String notes = (String) requestData.get("notes");

        ByteArrayInputStream in = excelService.exportExcel(vehicleInfo, data, notes);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=output.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}
