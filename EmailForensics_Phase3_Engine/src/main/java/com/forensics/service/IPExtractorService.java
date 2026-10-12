
package com.forensics.service;
import java.util.*; import java.util.regex.*;
public class IPExtractorService{
 public List<String> extract(String text){
  List<String> ips=new ArrayList<>();
  Matcher m=Pattern.compile("\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b").matcher(text);
  while(m.find()) ips.add(m.group());
  return ips;
 }
}
