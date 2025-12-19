import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { useAuth } from "../context/AuthContext";
import { GENDERS } from "../constants/genders";
import {
  createPatient,
  updatePatient,
  searchPatients,
  deactivatePatient,
  activatePatient,
} from "../api/patientsApi";

const emptyForm = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "MALE",
  phone: "",
  email: "",
  address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

export default function ReceptionPatientPage() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [onlyActive, setOnlyActive] = useState(true);

  const [query, setQuery] = useState("");
  const [patients, setpatients] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [createForm, setCreateForm] = useState({ ...emptyForm });
  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [selectedPatient, setSelectedPatient] = useState(null);

  async function load() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await searchPatients(token, query, onlyActive);
      setpatients(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [onlyActive]);

  function openCreate() {
    setError("");
    setSuccess("");
    setCreateForm({ ...emptyForm });
    setCreateOpen(true);
  }

  function openEdit(row) {
    setError("");
    setSuccess("");
    setSelectedPatient(row);
    setEditForm({
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      dob: row.dob || "",
      gender: row.gender || "MALE",
      phone: row.phone || "",
      email: row.email || "",
      address: row.address || "",
      emergencyContactName: row.emergencyContactName || "",
      emergencyContactPhone: row.emergencyContactPhone || "",
    });
    setEditOpen(true);
  }

  function normalizePayload(form) {
    const t = (s) => (s === null ? null : String(s).trim());
    const emptyToNull = (s) => {
      const v = t(s);
      return v && v.length ? v : null;
    };

    return {
      firstName: t(form.firstName),
      lastName: t(form.lastName),
      dob: form.dob,
      gender: form.gender,
      phone: emptyToNull(form.phone),
      email: emptyToNull(form.email),
      address: emptyToNull(form.address),
      emergencyContactName: emptyToNull(form.emergencyContactName),
      emergencyContactPhone: emptyToNull(form.emergencyContactPhone),
    };
  }

  async function submitCreate() {
    setError("");
    setSuccess("");
    try {
      if (!createForm.firstName.trim())
        throw new Error("First name is required");
      if (!createForm.lastName.trim()) throw new Error("Last name is required");
      if (!createForm.dob.trim()) throw new Error("Date of birth is required");

      const res = await createPatient(token, normalizePayload(createForm));
      setCreateOpen(false);
      setSuccess(`Patient registered successfully. OP Number: ${res.opNumber}`);
      await load();
    } catch (e) {
      setError(e.message || "Failed to register patient");
    }
  }

  async function submitEdit() {
    setError("");
    setSuccess("");

    try {
      if (!selectedPatient?.id) throw new Error("No patient selected");
      if (!editForm.firstName.trim()) throw new Error("First name is required");
      if (!editForm.lastName.trim()) throw new Error("Last name is required");
      if (!editForm.dob) throw new Error("Date of birth is required");

      await updatePatient(
        token,
        selectedPatient.id,
        normalizePayload(editForm)
      );
      setEditOpen(false);
      setSuccess("Patient updated successfully");
      await load();
    } catch (e) {
      setError(e.message || "Failed to update patient");
    }
  }

  async function toggleActive(row) {
    setError("");
    setSuccess("");
    try {
      if (row.active) {
        await deactivatePatient(token, row.id);
        setSuccess("Patient deactivated");
      } else {
        await activatePatient(token, row.id);
        setSuccess("Patient activated");
      }
      await load();
    } catch (e) {
      setError(e.message || "Failed to update status");
    }
  }

  const columns = [
    { field: "opNumber", headerName: "OP No", width: 110 },
    { field: "firstName", headerName: "First Name", width: 140 },
    { field: "lastName", headerName: "Last Name", width: 140 },
    { field: "dob", headerName: "DOB", width: 120 },
    { field: "gender", headerName: "Gender", width: 110 },
    { field: "phone", headerName: "Phone", width: 140 },
    {
      field: "active",
      headerName: "Status",
      width: 120,
      renderCell: (params) =>
        params.value ? (
          <Chip label="Active" size="small" />
        ) : (
          <Chip label="Inactive" size="small" variant="outlined" />
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", gap: 1, alignItems: "flex-start", pt: 0.5 }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => openEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => toggleActive(params.row)}
          >
            {params.row.active ? "Deactivate" : "Activate"}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Reception — Patient Registration</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Show inactive</Typography>
            <Switch
              checked={!onlyActive}
              onChange={(e) => setOnlyActive(!e.target.checked)}
            />
          </Box>
          <Button variant="contained" onClick={openCreate}>
            Register Patient
          </Button>
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search (OP No / Name / Phone)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ minWidth: 320 }}
        />
        <Button variant="outlined" onClick={load} disabled={loading}>
          Search
        </Button>
        <Button
          variant="text"
          onClick={() => {
            setQuery("");
            // load all active/inactive based on toggle
            setTimeout(load, 0);
          }}
        >
          Clear
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ height: 560, width: "100%" }}>
        <DataGrid
          rows={patients}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </Box>

      {/* Create Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Register Patient</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField
            label="First Name"
            value={createForm.firstName}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, firstName: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Last Name"
            value={createForm.lastName}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, lastName: e.target.value }))
            }
            fullWidth
          />

          <TextField
            label="DOB"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={createForm.dob}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, dob: e.target.value }))
            }
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              value={createForm.gender}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, gender: e.target.value }))
              }
            >
              {GENDERS.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Phone (optional)"
            value={createForm.phone}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, phone: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Email (optional)"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, email: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Address (optional)"
            value={createForm.address}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, address: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Emergency Contact Name (optional)"
            value={createForm.emergencyContactName}
            onChange={(e) =>
              setCreateForm((p) => ({
                ...p,
                emergencyContactName: e.target.value,
              }))
            }
            fullWidth
          />
          <TextField
            label="Emergency Contact Phone (optional)"
            value={createForm.emergencyContactPhone}
            onChange={(e) =>
              setCreateForm((p) => ({
                ...p,
                emergencyContactPhone: e.target.value,
              }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitCreate}>
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Patient</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          {/* OP number (read-only display) */}
          <TextField
            label="OP Number"
            value={selectedPatient?.opNumber || ""}
            InputProps={{ readOnly: true }}
            fullWidth
          />

          <TextField
            label="First Name"
            value={editForm.firstName}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, firstName: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Last Name"
            value={editForm.lastName}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, lastName: e.target.value }))
            }
            fullWidth
          />

          <TextField
            label="DOB"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editForm.dob}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, dob: e.target.value }))
            }
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              value={editForm.gender}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, gender: e.target.value }))
              }
            >
              {GENDERS.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Phone (optional)"
            value={editForm.phone}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, phone: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Email (optional)"
            value={editForm.email}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, email: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Address (optional)"
            value={editForm.address}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, address: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Emergency Contact Name (optional)"
            value={editForm.emergencyContactName}
            onChange={(e) =>
              setEditForm((p) => ({
                ...p,
                emergencyContactName: e.target.value,
              }))
            }
            fullWidth
          />
          <TextField
            label="Emergency Contact Phone (optional)"
            value={editForm.emergencyContactPhone}
            onChange={(e) =>
              setEditForm((p) => ({
                ...p,
                emergencyContactPhone: e.target.value,
              }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
