package com.forensics.email;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CryptographicValidationIntegrationTest {

    private EmailForensicAnalyzer analyzer;

    @BeforeEach
    public void setUp() {
        analyzer = new EmailForensicAnalyzer();
    }

    @Test
    public void testValidDkimSignature() {
        String sampleHeaders = "DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=example.com; s=selector1;\n" +
                              " h=From:To:Subject; bh=2jmj7l5rSw0yVb/vlWAYkK/YBwk=;\n" +
                              " b=OgnCY+ValidSignatureMockData;\n" +
                              "From: sender@example.com\n" +
                              "Subject: Secure Communication";

        boolean isValid = analyzer.verifyDkim(sampleHeaders);
        assertTrue(isValid, "DKIM cryptographic signature should pass verification.");
    }

    @Test
    public void testTamperedHeaderDetection() {
        String tamperedHeaders = "DKIM-Signature: v=1; a=rsa-sha256; d=example.com; s=selector1;\n" +
                                 "bh=INVALID_HASH_VALUE_TAMPERED;\n" +
                                 "From: attacker@malicious.com\n" +
                                 "Subject: Phishing Attempt";

        boolean isValid = analyzer.verifyDkim(tamperedHeaders);
        assertFalse(isValid, "Tampered email headers should fail cryptographic validation.");
    }
}