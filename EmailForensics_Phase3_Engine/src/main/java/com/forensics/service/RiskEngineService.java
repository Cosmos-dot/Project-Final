
package com.forensics.service;
public class RiskEngineService{
 public int score(String spf,String dkim,String dmarc){
  int score=0;
  if("FAIL".equals(spf)) score+=30;
  if("FAIL".equals(dkim)) score+=30;
  if("FAIL".equals(dmarc)) score+=40;
  return score;
 }
}
