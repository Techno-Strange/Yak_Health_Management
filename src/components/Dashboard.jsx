// components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabass";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalYaks: 0,
    vaccinatedYaks: 0,
    needsAttention: 0,
    totalFarmers: 0,
  });
  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // 1. Total Yaks
      const { count: totalYaksCount } = await supabase
        .from("yak")
        .select("*", { count: "exact", head: true });

      // 2. Total Vaccinations
      const { count: vaccinatedCount } = await supabase
        .from("vaccination")
        .select("*", { count: "exact", head: true });

      // 3. Needs Attention — based on last vaccination date (> 1 year)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data: vaccinationData } = await supabase
        .from("vaccination")
        .select("yak_id, Date")
        .order("Date", { ascending: false });

      const latestVaccinationByYak = {};
      vaccinationData?.forEach(v => {
        if (!latestVaccinationByYak[v.yak_id]) {
          latestVaccinationByYak[v.yak_id] = v.Date;
        }
      });

      const needsAttentionCount = Object.values(latestVaccinationByYak).filter(
        date => new Date(date) < oneYearAgo
      ).length;

      // 4. Registered Farmers & Scientists
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const registeredUsersCount =
        authUsers?.users.filter(
          user => user.email?.toLowerCase() !== "admin@gmail.com"
        ).length || 0;

      // 5. Recent Yaks
      const { data: recentYaks } = await supabase
        .from("yak")
        .select(
          "id, name, ear_tag, date_of_birth, breed, sex, remarks, created_at, owner_name"
        )
        .order("created_at", { ascending: false })
        .limit(5);

      const actions =
        recentYaks?.map(yak => ({
          text: `Added new yak: <strong>${yak.name || yak.ear_tag}</strong> (${yak.breed || "Yak"})`,
          time: formatTime(yak.created_at),
        })) || [];

      setStats({
        totalYaks: totalYaksCount || 0,
        vaccinatedYaks: vaccinatedCount || 0,
        needsAttention: needsAttentionCount || 0,
        totalFarmers: registeredUsersCount,
      });

      setRecentActions(
        actions.length > 0 ? actions : [{ text: "No recent yak added", time: "" }]
      );
      setLoading(false);
    } catch (error) {
      console.error("Dashboard Error:", error.message);
      setLoading(false);
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "120px",
          fontSize: "22px",
          color: "#2c3e50",
        }}
      >
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      <header className="admin-dashboard-header">
        <h1>Veteran Dashboard</h1>
        <p>Welcome back, Veteran! Here's your yak health system overview.</p>
      </header>

      <div className="stats-grid-full">
        <div className="stat-card-large">
          <div className="stat-icon-large yak">Yak</div>
          <div className="stat-content">
            <h3>Total Yaks Registered</h3>
            <h2>{stats.totalYaks}</h2>
            <p className="trend up">Up Live from yak table</p>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon-large vaccinated">Syringe</div>
          <div className="stat-content">
            <h3>Fully Vaccinated</h3>
            <h2>{stats.vaccinatedYaks}</h2>
            <p className="trend up">
              Up{" "}
              {stats.totalYaks > 0
                ? Math.round(
                    (stats.vaccinatedYaks / stats.totalYaks) * 100
                  )
                : 0}
              % coverage
            </p>
          </div>
        </div>

        {/* ✅ MODIFIED WARNING CARD ONLY */}
        <div className="stat-card-large">
          <div
            className={`stat-icon-large ${
              stats.needsAttention > 0 ? "alert" : "success"
            }`}
          >
            {stats.needsAttention > 0 ? "Warning" : "OK"}
          </div>
          <div className="stat-content">
            <h3>Needs Attention</h3>
            <h2>{stats.needsAttention}</h2>
            {stats.needsAttention > 0 ? (
              <p className="trend alert">Alert Require checkup</p>
            ) : (
              <p className="trend up">All yaks are healthy</p>
            )}
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon-large farmers">People</div>
          <div className="stat-content">
            <h3>Registered Farmers & Scientists</h3>
            <h2>{stats.totalFarmers}</h2>
            <p className="trend up">Up All users except admin</p>
          </div>
        </div>
      </div>

      <div className="manage-yaks-bottom">
        <button
          onClick={() => navigate("/yak-management")}
          className="btn-manage-yaks-bottom"
        >
          Manage Yaks
        </button>
      </div>
    </div>
  );
}
