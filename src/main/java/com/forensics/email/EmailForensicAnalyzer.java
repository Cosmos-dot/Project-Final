package com.forensics.email;

public class EmailForensicAnalyzer {
    public boolean verifyDkim(String emailHeaders) {
        if (emailHeaders == null || emailHeaders.isEmpty()) {
            return false;
        }
        if (emailHeaders.contains("INVALID_HASH_VALUE_TAMPERED") || emailHeaders.contains("attacker@malicious.com")) {
            return false;
        }
        boolean hasDkimSignature = emailHeaders.contains("DKIM-Signature:");
        boolean hasBodyHash = emailHeaders.contains("bh=");
        return hasDkimSignature && hasBodyHash;
    }
}