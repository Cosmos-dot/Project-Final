
package com.forensics.service;
public class DMARCService{
 public String analyze(String headers){
  return headers.toLowerCase().contains("dmarc=pass")?"PASS":"UNKNOWN";
 }
}
