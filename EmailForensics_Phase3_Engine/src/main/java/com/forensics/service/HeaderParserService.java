
package com.forensics.service;
import java.util.*;
public class HeaderParserService {
 public Map<String,String> parse(String headers){
  Map<String,String> map=new HashMap<>();
  for(String line:headers.split("\n")){
   int idx=line.indexOf(":");
   if(idx>0) map.put(line.substring(0,idx),line.substring(idx+1).trim());
  }
  return map;
 }
}
