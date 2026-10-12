import React, { useState } from "react";
import "../styles/Dashboard.css";

import { motion } from "framer-motion";

import {
  FaShieldAlt,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

export default function Dashboard() {
  const [header, setHeader] = useState("");
  const [result, setResult] = useState(null);

  const analyzeHeader = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          header: header,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to backend.");
    }
  };

  const clearData = () => {
    setHeader("");
    setResult(null);
  };

  return (
    <div className="dashboard">

      <motion.div
        className="navbar"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2>
          <FaShieldAlt /> Email Header Investigation Analyzer
        </h2>
      </motion.div>

      <motion.div
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1>Analyze Email Headers Like a Digital Forensic Expert</h1>

        <p>
          Detect phishing, spoofing, forged email senders and suspicious
          email paths within seconds.
        </p>
      </motion.div>

      <textarea
        className="headerBox"
        rows="12"
        placeholder="Paste Email Header Here..."
        value={header}
        onChange={(e) => setHeader(e.target.value)}
      />

      <div className="buttons">

        <button className="analyzeBtn" onClick={analyzeHeader}>
          <FaSearch /> Analyze Header
        </button>

        <button className="clearBtn" onClick={clearData}>
          <FaTrash /> Clear
        </button>

      </div>

      {result && (

        <motion.div
          className="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >

          <div className="card">
            <h3>SPF</h3>
            <p>{result.spf}</p>
          </div>

          <div className="card">
            <h3>DKIM</h3>
            <p>{result.dkim}</p>
          </div>

          <div className="card">
            <h3>DMARC</h3>
            <p>{result.dmarc}</p>
          </div>

          <div className="card">
            <h3>Risk Score</h3>

            <p>{result.riskScore}%</p>

            <div className="progress">
              <div
                className="progressFill"
                style={{
                  width: `${result.riskScore}%`,
                }}
              ></div>
            </div>

          </div>

        </motion.div>

      )}

    </div>
  );
}