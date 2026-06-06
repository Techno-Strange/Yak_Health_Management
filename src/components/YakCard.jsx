import React from "react";
import { Link } from "react-router-dom";

// Helper function to calculate age from Date of Birth
function getAge(dobString) {
  if (!dobString) return "?";
  try {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  } catch (e) {
    console.error("Could not parse DOB:", dobString);
    return "?";
  }
}

export default function YakCard({ yak }) {
  const age = getAge(yak.DOB);

  return (
    <div className="yak-card">
      <h3>{yak.Name || "Unnamed"} ({yak.Animal_ID})</h3>
      <p>{yak.Breed} • {yak.Sex} • {age} yrs</p>
      <p>{yak.Remarks || "No remarks"}</p>

      {/* ONLY THIS LINE CHANGED – NOW IT WORKS 100% */}
      <Link 
        to={`/yak-details/${yak.id}`} 
        className="btn btn-primary"
      >
        View
      </Link>
    </div>
  );
}