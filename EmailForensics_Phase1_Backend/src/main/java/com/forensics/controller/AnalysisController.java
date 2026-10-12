package com.forensics.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/analyze")
@CrossOrigin(origins = "*")
public class AnalysisController {

    @PostMapping
    public Map<String, Object> analyze(@RequestBody Map<String, String> body) {

        String header = body.get("header");

        String spf =
            header.toLowerCase().contains("spf=pass")
            ? "PASS" : "FAIL";

        String dkim =
            header.toLowerCase().contains("dkim=pass")
            ? "PASS" : "FAIL";

        String dmarc =
            header.toLowerCase().contains("dmarc=pass")
            ? "PASS" : "FAIL";

        int riskScore = 0;

        if ("FAIL".equals(spf)) riskScore += 30;
        if ("FAIL".equals(dkim)) riskScore += 30;
        if ("FAIL".equals(dmarc)) riskScore += 40;

        Map<String,Object> result = new HashMap<>();

        result.put("spf", spf);
        result.put("dkim", dkim);
        result.put("dmarc", dmarc);
        result.put("riskScore", riskScore);

        return result;
    }
}