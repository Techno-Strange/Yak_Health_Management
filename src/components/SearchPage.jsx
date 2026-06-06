import { useEffect, useState } from "react";
// 1. Import your supabase client (adjust path if needed)
import { supabase } from "./supabass"; 
import YakCard from "./YakCard";
import { Link } from "react-router-dom"; // Kept this import

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [yaks, setYaks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load(q = "") {
    setLoading(true);
    setError(null); 

    try {
      // 1. Query the 'yak' table (matches SQL)
      let queryBuilder = supabase
        .from('yak') 
        .select('*');

      // 2. If there's a search query, filter on "Animal_ID"
      if (q) {
        // We use quotes ("") because the column name is capitalized
        queryBuilder = queryBuilder.ilike('"Animal_ID"', `%${q}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        throw error;
      }

      if (data) {
        // 3. Map the Supabase 'id' (uuid) to '_id' for the Link
        const formattedData = data.map(yak => ({
          ...yak,
          _id: yak.id 
        }));
        setYaks(formattedData);
      }

    } catch (error) {
      console.error("Error loading yaks:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); 
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(query); 
  };

  return (
    <div className="search-portal-container">
      <h1 className="portal-title">Yak Search Portal</h1>

      <section className="search-form-container">
        <h2 className="section-title">Search for Yak</h2>
        <form className="search-bar" onSubmit={handleSearch}>
          <label htmlFor="yak-search" className="search-label">Yak Animal Number</label>
          <div className="search-input-group">
            <input
              id="yak-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Yak Number (e.g., YAK001)"
              className="search-input"
            />
            <button type="submit" className="btn btn-primary search-button">Search</button>
          </div>
        </form>
      </section>

      <section className="results-container">
        <h2 className="section-title">All Yak Records</h2>
        {loading && <div className="loading-message">Loading...</div>}
        
        {error && <div className="no-records" style={{ color: 'red' }}>Error: {error}</div>}

        {!loading && !error && (
          <div className="yak-grid">
            {yaks.length === 0 && <div className="no-records">No records found</div>}
            {yaks.map((y) => (
              <YakCard key={y._id} yak={y} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}