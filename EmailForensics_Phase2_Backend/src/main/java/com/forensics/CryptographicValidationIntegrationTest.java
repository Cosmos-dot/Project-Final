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
        // Arrange: Sample email headers with a valid DKIM signature and body hash
        String sampleHeaders = "DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=example.com; s=selector1;\n" +
                              " h=From:To:Subject; bh=2jmj7l5rSw0yVb/vlWAYkK/YBwk=;\n" +
                              " b=OgnCY+ValidSignatureMockData;\n" +
                              "From: sender@example.com\n" +
                              "Subject: Secure Communication";

        // Act: Execute cryptographic verification
        boolean isValid = analyzer.verifyDkim(sampleHeaders);
        
        // Assert: Verify that valid signatures pass
        assertTrue(isValid, "DKIM cryptographic signature should pass verification.");
    }

    @Test
    public void testTamperedHeaderDetection() {
        // Arrange: Headers with a compromised/invalid hash or malicious sender tag
        String tamperedHeaders = "DKIM-Signature: v=1; a=rsa-sha256; d=example.com; s=selector1;\n" +
                                 "bh=INVALID_HASH_VALUE_TAMPERED;\n" +
                                 "From: attacker@malicious.com\n" +
                                 "Subject: Phishing Attempt";

        // Act: Execute verification on tampered data
        boolean isValid = analyzer.verifyDkim(tamperedHeaders);
        
        // Assert: Verify that tampering fails validation
        assertFalse(isValid, "Tampered email headers should fail cryptographic validation.");
    }
}