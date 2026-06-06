// components/YakDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabass";

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
  </svg>
);

export default function YakDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const yakId = id || searchParams.get("id");

  const [yak, setYak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfReady, setPdfReady] = useState(false);

  const [vaccinations, setVaccinations] = useState([]);

  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
    script2.async = true;

    script1.onload = () => document.head.appendChild(script2);
    script2.onload = () => setPdfReady(true);

    document.head.appendChild(script1);
  }, []);

  useEffect(() => {
    if (!yakId) {
      setLoading(false);
      return;
    }

    async function fetchYak() {
      try {
        const { data, error } = await supabase
          .from("yak")
          .select("*")
          .eq("id", yakId)
          .single();

        if (error) throw error;
        setYak(data);
      } catch (err) {
        console.error(err);
        alert("Yak not found or invalid ID");
        navigate("/yak-management");
      } finally {
        setLoading(false);
      }
    }

    fetchYak();
  }, [yakId, navigate]);

  useEffect(() => {
    if (!yakId) return;

    async function fetchVaccinations() {
      try {
        const { data, error } = await supabase
          .from("vaccination")
          .select("*")
          .eq("yak_id", yakId)
          .order("Date", { ascending: false });

        if (error) throw error;
        setVaccinations(data);
      } catch (err) {
        console.error("Vaccination fetch error:", err);
      }
    }

    fetchVaccinations();
  }, [yakId]);

  const calculateAge = () => {
    if (!yak.DOB) return "—";
    const birth = new Date(yak.DOB);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const downloadPdf = () => {
    if (!pdfReady || !yak) return alert("Please wait...");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Yak Health Report", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Name: ${yak.Name || "N/A"}`, 20, 40);
    doc.text(`Ear Tag: ${yak.Animal_ID}`, 20, 50);
    doc.text(`Breed: ${yak.Breed}`, 20, 60);
    doc.text(`Sex: ${yak.Sex}`, 20, 70);
    doc.text(`DOB: ${yak.DOB ? new Date(yak.DOB).toLocaleDateString() : "N/A"}`, 20, 80);
    doc.text(`Age: ${calculateAge(yak.date_of_birth)} years`, 20, 90);
    doc.text(`Remarks: ${yak.Remarks || "None"}`, 20, 100);

    doc.setFontSize(16);
    doc.text("Vaccination History", 20, 120);

    if (vaccinations.length > 0) {
      const tableData = vaccinations.map(v => [
        v.Vaccination_ID || "—",
        v.Vaccine_Name || "—",
        v.Dosage || "—", // ✅ DOSAGE ADDED
        v.Date ? new Date(v.Date).toLocaleDateString() : "—",
        v.Remarks || "—"
      ]);

      doc.autoTable({
        head: [["Vaccination ID", "Vaccine Name", "Dosage", "Date", "Remarks"]], // ✅ DOSAGE ADDED
        body: tableData,
        startY: 130,
      });
    } else {
      doc.setFontSize(12);
      doc.text("No vaccination records available.", 20, 130);
    }

    doc.save(`${yak.ear_tag}_Report.pdf`);
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (!yak) return null;

  return (
    <div className="yak-detail-container">
      <div className="detail-header">
        <Link to="/yak-management" className="back-link">Back</Link>
        <button onClick={downloadPdf} className="btn btn-success" disabled={!pdfReady}>
          <DownloadIcon /> {pdfReady ? "Download PDF" : "Loading PDF..."}
        </button>
      </div>

      <div className="yak-detail-card">
        <div className="card-header">
          <img src="/assets/DSC_4375.JPG" alt={yak.Name} className="yak-avatar" />
          <h2>{yak.Name || "Unnamed Yak"}</h2>
          <p className="yak-id">{yak.Animal_ID}</p>
          <span className={`sex-badge ${yak.Sex?.toLowerCase() || ""}`}>
            {yak.Sex || "—"}
          </span>
        </div>

        <div className="card-body">
          <dl className="definition-list">
            <div><dt>Name</dt><dd>{yak.Name || "—"}</dd></div>
            <div><dt>Ear Tag</dt><dd><strong>{yak.Animal_ID || "—"}</strong></dd></div>
            <div><dt>Breed</dt><dd>{yak.Breed || "—"}</dd></div>
            <div><dt>Sex</dt><dd>{yak.Sex || "—"}</dd></div>
            <div><dt>Date of Birth</dt><dd>{yak.DOB ? new Date(yak.DOB).toLocaleDateString() : "—"}</dd></div>
            <div><dt>Age</dt><dd>{calculateAge(yak.date_of_birth)} years</dd></div>
            <div><dt>Remarks</dt><dd>{yak.Remarks || "No remarks"}</dd></div>
          </dl>
        </div>
      </div>

      <div className="vaccination-section">
        <h3>Vaccination History</h3>

        {vaccinations.length === 0 ? (
          <p>No vaccination records found.</p>
        ) : (
          <table className="yak-table">
            <thead>
              <tr>
                <th>Vaccination ID</th>
                <th>Vaccine Name</th>
                <th>Dosage</th> {/* ✅ DOSAGE ADDED */}
                <th>Date</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {vaccinations.map((v) => (
                <tr key={v.id}>
                  <td>{v.Vaccination_ID || "—"}</td>
                  <td>{v.Vaccine_Name || "—"}</td>
                  <td>{v.Dosage || "—"}</td> {/* ✅ DOSAGE ADDED */}
                  <td>{v.Date ? new Date(v.Date).toLocaleDateString() : "—"}</td>
                  <td>{v.Remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
