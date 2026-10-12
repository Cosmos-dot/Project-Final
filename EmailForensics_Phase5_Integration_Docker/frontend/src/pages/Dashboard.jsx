import React, { useState, useEffect, useRef } from "react";
import "../styles/Dashboard.css";

import { motion } from "framer-motion";

import {
  FaShieldAlt,
  FaSearch,
  FaTrash,
  FaPaperclip,
  FaFilePdf,
} from "react-icons/fa";

export default function Dashboard() {
  const [header, setHeader] = useState("");
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const headerBoxRef = useRef(null);

  // =========================================
  // ANALYZE HEADER
  // =========================================

  const analyzeHeader = async (value = header) => {
    const headerValue = String(value || "").trim();

    if (!headerValue) {
      alert("Please paste an email header or attach an EML file.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            header: headerValue,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error("Analysis Error:", error);

      alert("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };


  // =========================================
  // ENTER KEY
  // ENTER ANYWHERE ON DASHBOARD
  // =========================================

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      // Only react to Enter
      if (event.key !== "Enter") {
        return;
      }

      // Prevent repeated Enter events
      if (event.repeat) {
        return;
      }

      // If user is currently clicking a button,
      // allow the button's normal behavior
      const activeElement = document.activeElement;

      if (
        activeElement &&
        activeElement.tagName === "BUTTON"
      ) {
        return;
      }

      // Stop browser default behavior
      event.preventDefault();
      event.stopPropagation();

      // Get the latest value
      let currentValue = header;

      if (headerBoxRef.current) {
        currentValue = headerBoxRef.current.value;
      }

      // If there is no header, do nothing
      if (!String(currentValue).trim()) {
        return;
      }

      // Analyze
      analyzeHeader(currentValue);
    };

    window.addEventListener(
      "keydown",
      handleGlobalKeyDown,
      true
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleGlobalKeyDown,
        true
      );
    };
  }, [header]);


  // =========================================
  // EML FILE UPLOAD
  // =========================================

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    // Check EML extension
    if (
      !file.name
        .toLowerCase()
        .endsWith(".eml")
    ) {
      alert("Please select a valid .eml file.");

      event.target.value = "";

      return;
    }

    // Display filename
    setFileName(file.name);

    // Read EML
    const reader = new FileReader();

    reader.onload = (e) => {
      const emailContent = e.target.result;

      // Find end of email headers
      const separator =
        emailContent.search(/\r?\n\r?\n/);

      let emailHeader;

      if (separator >= 0) {
        emailHeader =
          emailContent.slice(0, separator);
      } else {
        emailHeader = emailContent;
      }

      // Put header into textarea
      setHeader(emailHeader);

      // Remove previous result
      setResult(null);
    };

    reader.onerror = () => {
      alert("Unable to read the EML file.");
    };

    reader.readAsText(file);
  };


  // =========================================
  // CLEAR
  // =========================================

  const clearData = () => {
    setHeader("");
    setResult(null);
    setFileName("");

    const fileInput =
      document.getElementById("emlUpload");

    if (fileInput) {
      fileInput.value = "";
    }

    // Put cursor back into textarea
    setTimeout(() => {
      if (headerBoxRef.current) {
        headerBoxRef.current.focus();
      }
    }, 0);
  };


  // =========================================
  // RISK LEVEL
  // =========================================

  const getRiskLevel = () => {
    if (!result) {
      return "LOW";
    }

    // Use backend risk level if available
    if (result.riskLevel) {
      return String(
        result.riskLevel
      ).toUpperCase();
    }

    const score =
      Number(result.riskScore || 0);

    if (score >= 70) {
      return "HIGH";
    }

    if (score >= 40) {
      return "MEDIUM";
    }

    return "LOW";
  };


  // =========================================
  // SPF EXPLANATION
  // =========================================

  const getSPFExplanation = () => {
    const value =
      String(result?.spf || "")
        .toLowerCase();

    if (value.includes("pass")) {
      return "The sending server is authorized by the sender domain.";
    }

    if (value.includes("fail")) {
      return "The sending server could not be verified as authorized by the sender domain.";
    }

    return "SPF verification produced a result that requires attention.";
  };


  // =========================================
  // DKIM EXPLANATION
  // =========================================

  const getDKIMExplanation = () => {
    const value =
      String(result?.dkim || "")
        .toLowerCase();

    if (value.includes("pass")) {
      return "The email's DKIM signature was successfully verified.";
    }

    if (value.includes("fail")) {
      return "The email's DKIM signature could not be successfully verified.";
    }

    return "DKIM verification produced a result that requires attention.";
  };


  // =========================================
  // DMARC EXPLANATION
  // =========================================

  const getDMARCExplanation = () => {
    const value =
      String(result?.dmarc || "")
        .toLowerCase();

    if (value.includes("pass")) {
      return "The email satisfies the domain's DMARC authentication policy.";
    }

    if (value.includes("fail")) {
      return "The email did not satisfy the domain's DMARC authentication policy.";
    }

    return "DMARC verification produced a result that requires attention.";
  };


  // =========================================
  // RISK EXPLANATION
  // =========================================

  const getRiskExplanation = () => {
    const level = getRiskLevel();

    if (level === "HIGH") {
      return "The email has a high authentication-related risk and requires caution.";
    }

    if (level === "MEDIUM") {
      return "The email contains authentication-related indicators that require attention.";
    }

    return "The email has a low authentication-related risk based on the analysis.";
  };


  // =========================================
  // PRINT / SAVE REPORT
  // =========================================

  const generateReport = () => {
    window.print();
  };


  // =========================================
  // VALUES
  // =========================================

  const riskLevel = getRiskLevel();

  const riskScore = Math.min(
    Number(result?.riskScore || 0),
    100
  );


  // =========================================
  // DASHBOARD
  // =========================================

  return (
    <div className="dashboard">


      {/* =====================================
          NAVBAR
      ====================================== */}

      <motion.div
        className="navbar"
        initial={{
          y: -40,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
      >

        <h2>
          <FaShieldAlt />
          Email Header Investigation Analyzer
        </h2>

      </motion.div>


      {/* =====================================
          HERO
      ====================================== */}

      <motion.div
        className="hero"
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
      >

        <h1>
          Analyze Email Headers Like a Digital Forensic Expert
        </h1>

        <p>
          Detect phishing, spoofing, forged email senders
          and suspicious email paths within seconds.
        </p>

      </motion.div>


      {/* =====================================
          INPUT PANEL
      ====================================== */}

      <motion.div
        className="inputPanel"
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
      >

        <h2>
          Analyze Email
        </h2>

        <p className="inputDescription">
          Paste Email Header or Attach an EML File
        </p>


        {/* =================================
            HEADER TEXTAREA
        ================================== */}

        <textarea
          ref={headerBoxRef}
          className="headerBox"
          rows="12"
          placeholder="Paste Email Header Here..."
          value={header}
          onChange={(event) => {
            setHeader(event.target.value);
          }}
        />


        {/* ENTER MESSAGE */}

        <p className="enterHint">
          Press Enter to Analyze
        </p>


        {/* =================================
            OR
        ================================== */}

        <div className="orDivider">
          <span>OR</span>
        </div>


        {/* =================================
            EML UPLOAD
        ================================== */}

        <div className="uploadSection">

          <input
            type="file"
            id="emlUpload"
            accept=".eml,message/rfc822"
            onChange={handleFileChange}
            hidden
          />

          <label
            htmlFor="emlUpload"
            className="attachBtn"
          >

            <FaPaperclip />

            Attach EML File

          </label>


          {fileName && (
            <div className="fileName">
              📄 {fileName}
            </div>
          )}

        </div>


        {/* =================================
            BUTTONS
        ================================== */}

        <div className="buttons">

          <button
            type="button"
            className="analyzeBtn"
            onClick={() => analyzeHeader(header)}
            disabled={loading}
          >

            <FaSearch />

            {loading
              ? "Analyzing..."
              : "Analyze Header"}

          </button>


          <button
            type="button"
            className="clearBtn"
            onClick={clearData}
          >

            <FaTrash />

            Clear

          </button>

        </div>

      </motion.div>


      {/* =====================================
          RESULTS
      ====================================== */}

      {result && (

        <motion.div
          className="reportArea"
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
        >


          <h2 className="resultTitle">
            Analysis Result
          </h2>


          {/* =================================
              RESULT CARDS
          ================================== */}

          <div className="results">


            {/* SPF */}

            <div className="card">

              <h3>
                SPF
              </h3>

              <p>
                {result.spf || "N/A"}
              </p>

            </div>


            {/* DKIM */}

            <div className="card">

              <h3>
                DKIM
              </h3>

              <p>
                {result.dkim || "N/A"}
              </p>

            </div>


            {/* DMARC */}

            <div className="card">

              <h3>
                DMARC
              </h3>

              <p>
                {result.dmarc || "N/A"}
              </p>

            </div>


            {/* RISK SCORE */}

            <div className="card">

              <h3>
                Risk Score
              </h3>

              <p className="riskScoreText">
                {result.riskScore ?? 0}%
              </p>

              <div className="progress">

                <div
                  className="progressFill"
                  style={{
                    width:
                      `${riskScore}%`
                  }}
                ></div>

              </div>

            </div>


            {/* RISK LEVEL */}

            <div className="card riskCard">

              <h3>
                Risk Level
              </h3>

              <div
                className={
                  `riskLevel risk-${riskLevel.toLowerCase()}`
                }
              >
                {riskLevel}
              </div>

            </div>

          </div>


          {/* =================================
              REPORT EXPLANATION
          ================================== */}

          <div className="reportExplanation">

            <h2>
              Report Explanation
            </h2>


            {/* SPF */}

            <div className="explanationItem">

              <strong>
                SPF:
              </strong>

              <span>
                {getSPFExplanation()}
              </span>

            </div>


            {/* DKIM */}

            <div className="explanationItem">

              <strong>
                DKIM:
              </strong>

              <span>
                {getDKIMExplanation()}
              </span>

            </div>


            {/* DMARC */}

            <div className="explanationItem">

              <strong>
                DMARC:
              </strong>

              <span>
                {getDMARCExplanation()}
              </span>

            </div>


            {/* RISK */}

            <div className="explanationItem">

              <strong>
                Risk:
              </strong>

              <span>
                {getRiskExplanation()}
              </span>

            </div>


            {/* =================================
                OVERALL SUMMARY
            ================================== */}

            <div className="overallSummary">

              <h3>
                Overall Summary
              </h3>

              <p>
                The email header was analyzed using
                SPF, DKIM and DMARC authentication
                results. The calculated risk score
                and risk level indicate the
                authentication-related risk
                identified during the analysis.
              </p>

            </div>


            {/* =================================
                PRINT REPORT
            ================================== */}

            <button
              type="button"
              className="reportBtn"
              onClick={generateReport}
            >

              <FaFilePdf />

              Print / Save Report

            </button>

          </div>

        </motion.div>

      )}

    </div>
  );
}