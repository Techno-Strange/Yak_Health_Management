// components/YakManagement.jsx
import { useState, useEffect } from 'react';
import { supabase } from './supabass';

const YakManagement = () => {
  const [search, setSearch] = useState('');
  const [sexFilter, setSexFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);

  const [yaks, setYaks] = useState([]);
  const [allVaccinations, setAllVaccinations] = useState([]);

  const [newYak, setNewYak] = useState({
    Animal_ID: '',
    Name: '',
    DOB: '',
    Breed: '',
    Sex: 'Male',
    Remarks: '',
  });

  const [newVaccine, setNewVaccine] = useState({
    yak_id: '',
    Vaccination_ID: '',
    Vaccine_Name: '',
    Dosage: '', // ✅ DOSAGE ADDED
    Date: '',
    Remarks: '',
  });

  // ---------------- FETCH DATA ----------------
  const fetchYaks = async () => {
    const { data, error } = await supabase.from('yak').select('*');
    if (!error) setYaks(data || []);
  };

  const fetchAllVaccinations = async () => {
    const { data, error } = await supabase
      .from('vaccination')
      .select(`*, yak:yak_id (Name, Animal_ID)`)
      .order('Date', { ascending: false });

    if (!error) setAllVaccinations(data || []);
  };

  useEffect(() => {
    fetchYaks();
    fetchAllVaccinations();
  }, []);

  // ---------------- YAK CRUD ----------------
  const handleCreateYak = async () => {
    const parsedDate = new Date(newYak.DOB);
    if (isNaN(parsedDate)) return;

    const { data, error } = await supabase
      .from('yak')
      .insert([{ ...newYak, DOB: parsedDate.toISOString().split('T')[0] }])
      .select();

    if (!error) {
      setYaks([...yaks, data[0]]);
      setShowModal(false);
      setNewYak({
        Animal_ID: '',
        Name: '',
        DOB: '',
        Breed: '',
        Sex: 'Male',
        Remarks: '',
      });
    }
  };

  const handleDeleteYak = async (id) => {
    const { data } = await supabase.from('yak').delete().eq('id', id).select();
    if (data?.length) setYaks(yaks.filter(y => y.id !== id));
  };

  // ---------------- VACCINE CRUD ----------------
  const handleAddVaccination = async () => {
    const { data, error } = await supabase
      .from('vaccination')
      .insert([newVaccine])
      .select();

    if (!error) {
      setAllVaccinations([data[0], ...allVaccinations]);
      setShowVaccineModal(false);
      setNewVaccine({
        yak_id: '',
        Vaccination_ID: '',
        Vaccine_Name: '',
        Dosage: '', // ✅ DOSAGE RESET
        Date: '',
        Remarks: '',
      });
    }
  };

  const handleDeleteVaccination = async (id) => {
    const { data } = await supabase
      .from('vaccination')
      .delete()
      .eq('id', id)
      .select();

    if (data?.length)
      setAllVaccinations(allVaccinations.filter(v => v.id !== id));
  };

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '—';

  const filteredYaks = yaks.filter(
    (yak) =>
      ((yak.Name?.toLowerCase().includes(search.toLowerCase())) ||
        (yak.Animal_ID?.toLowerCase().includes(search.toLowerCase()))) &&
      (sexFilter === 'All' || yak.Sex === sexFilter)
  );

  return (
    <div className="events-wrapper">
      <div className="events-header">
        <div className="events-header-row">
          <h1>Yak Management</h1>

          <button
            className="button-primary create-button"
            onClick={() => setShowModal(true)}
          >
            + Add New Yak
          </button>

          <button
            className="button-primary create-button"
            style={{ marginLeft: "10px" }}
            onClick={() => setShowVaccineModal(true)}
          >
            + Add Vaccination
          </button>
        </div>

        <p className="events-subtitle">
          Create, edit, and manage all your yaks
        </p>
      </div>

      {/* YAK TABLE */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Yak (Name / ID)</th>
              <th>DOB</th>
              <th>Breed</th>
              <th>Sex</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredYaks.map((yak) => (
              <tr key={yak.id}>
                <td>
                  <div className="event-title">{yak.Name}</div>
                  <div className="event-subtitle">{yak.Animal_ID}</div>
                </td>
                <td>{formatDate(yak.DOB)}</td>
                <td>{yak.Breed}</td>
                <td>
                  <span className={`status-badge ${yak.Sex?.toLowerCase()}`}>
                    {yak.Sex}
                  </span>
                </td>
                <td>{yak.Remarks || "—"}</td>
                <td>
                  <span
                    className="action-link delete"
                    onClick={() => handleDeleteYak(yak.id)}
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADMIN VACCINATION TABLE */}
      <div className="table-container" style={{ marginTop: "40px" }}>
        <div className="vaccination-section">
          <h2>All Vaccinations</h2>

          <table className="table">
            <thead>
              <tr>
                <th>Yak</th>
                <th>Vaccination ID</th>
                <th>Vaccine</th>
                <th>Dosage</th> {/* ✅ DOSAGE COLUMN */}
                <th>Date</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allVaccinations.map((v) => (
                <tr key={v.id}>
                  <td>
                    {v.yak?.Name} ({v.yak?.Animal_ID})
                  </td>
                  <td>{v.Vaccination_ID || "—"}</td>
                  <td>{v.Vaccine_Name}</td>
                  <td>{v.Dosage || "—"}</td> {/* ✅ DOSAGE DISPLAY */}
                  <td>{formatDate(v.Date)}</td>
                  <td>{v.Remarks || "—"}</td>
                  <td>
                    <span
                      className="action-link delete"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this vaccination record?"
                          )
                        ) {
                          handleDeleteVaccination(v.id);
                        }
                      }}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD YAK MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Yak</h2>

            <input
              placeholder="Animal ID"
              onChange={(e) =>
                setNewYak({ ...newYak, Animal_ID: e.target.value })
              }
            />
            <input
              placeholder="Yak Name"
              onChange={(e) => setNewYak({ ...newYak, Name: e.target.value })}
            />
            <input
              type="date"
              onChange={(e) => setNewYak({ ...newYak, DOB: e.target.value })}
            />
            <input
              placeholder="Breed"
              onChange={(e) => setNewYak({ ...newYak, Breed: e.target.value })}
            />

            <select
              onChange={(e) => setNewYak({ ...newYak, Sex: e.target.value })}
            >
              <option>Male</option>
              <option>Female</option>
            </select>

            <textarea
              placeholder="Remarks"
              onChange={(e) =>
                setNewYak({ ...newYak, Remarks: e.target.value })
              }
            />

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="button-primary" onClick={handleCreateYak}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD VACCINATION MODAL */}
      {showVaccineModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Vaccination</h2>

            <select
              onChange={(e) =>
                setNewVaccine({ ...newVaccine, yak_id: e.target.value })
              }
            >
              <option value="">Select Yak</option>
              {yaks.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.Name} ({y.Animal_ID})
                </option>
              ))}
            </select>

            <input
              placeholder="Vaccination ID"
              onChange={(e) =>
                setNewVaccine({ ...newVaccine, Vaccination_ID: e.target.value })
              }
            />
            <input
              placeholder="Vaccine Name"
              onChange={(e) =>
                setNewVaccine({ ...newVaccine, Vaccine_Name: e.target.value })
              }
            />

            <input
              placeholder="Dosage"
              onChange={(e) =>
                setNewVaccine({ ...newVaccine, Dosage: e.target.value })
              }
            /> {/* ✅ DOSAGE INPUT */}

            <input
              type="date"
              onChange={(e) =>
                setNewVaccine({ ...newVaccine, Date: e.target.value })
              }
            />
            <textarea
              placeholder="Remarks"
              onChange={(e) =>
                setNewVaccine({ ...newVaccine, Remarks: e.target.value })
              }
            />

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowVaccineModal(false)}
              >
                Cancel
              </button>
              <button className="button-primary" onClick={handleAddVaccination}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YakManagement;
