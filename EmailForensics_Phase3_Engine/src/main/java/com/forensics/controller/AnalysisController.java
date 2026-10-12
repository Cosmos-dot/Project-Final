
package com.forensics.controller;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/analyze")
public class AnalysisController{
 @PostMapping
 public String analyze(@RequestBody String headers){
  return "Analysis completed";
 }
}
