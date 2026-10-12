
package com.forensics.service;
public class DKIMService{
 public String analyze(String headers){
  return headers.toLowerCase().contains("dkim=pass")?"PASS":"UNKNOWN";
 }
}
