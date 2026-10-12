
package com.forensics.service;
public class SPFService{
 public String analyze(String headers){
  return headers.toLowerCase().contains("spf=pass")?"PASS":"UNKNOWN";
 }
}
