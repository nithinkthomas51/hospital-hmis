import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { completeVisit, getDoctorVisitDetails } from "../api/doctorVisitsApi";
import { createVitals, listVitals } from "../api/clinicalVitalsApi";

const emptyVitals = {
  heightCm: "",
  weightKg: "",
  bpSystolic: "",
  bpDiastolic: "",
  temperatureC: "",
  pulse: "",
  spo2: "",
};

export default function DoctorVisitDetailsPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const visitId = Number(id);

  const [loading, setLoading] = useState(false);
  const [visit, setVisit] = useState(null);

  const [vitalsLoading, setVitalsLoading] = useState(false);
  const [vitals, setVitals] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [vitalsOpen, setVitalsOpen] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({ ...emptyVitals });

  const isReadOnly =
    visit?.status === "COMPLETED" || visit?.status === "CANCELLED";

  async function loadVisit() {
    setLoading(true);
    setError("");
    try {
      const data = await getDoctorVisitDetails(token, visitId);
      setVisit(data);
    } catch (e) {
      setError(e.message || "Failed to load visit");
    } finally {
      setLoading(false);
    }
  }

  async function loadVitals() {
    setVitalsLoading(true);
    setError("");
    try {
      const data = await listVitals(token, visitId);
      setVitals(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load vitals");
    } finally {
      setVitalsLoading(false);
    }
  }

  useEffect(() => {
    if (!Number.isFinite(visitId) || visitId <= 0) {
      setError("Invalid visit id");
      return;
    }
    loadVisit();
    loadVitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId, token]);

  function openVitalsDialog() {
    setError("");
    setSuccess("");
    setVitalsForm({ ...emptyVitals });
    setVitalsOpen(true);
  }

  function normalizeVitalsPayload(form) {
    const numOrNull = (v) => {
      const s = String(v ?? "").trim();
      if (!s.length) return null;
      const n = Number(s);
      if (Number.isNaN(n)) throw new Error(`Invalid number: ${v}`);
      return n;
    };

    const decOrNull = numOrNull;

    return {
      heightCm: numOrNull(form.heightCm),
      weightKg: decOrNull(form.weightKg),
      bpSystolic: numOrNull(form.bpSystolic),
      bpDiastolic: numOrNull(form.bpDiastolic),
      temperatureC: decOrNull(form.temperatureC),
      pulse: numOrNull(form.pulse),
      spo2: numOrNull(form.spo2),
    };
  }

  async function submitVitals() {
    setError("");
    setSuccess("");
    try {
      await createVitals(token, visitId, normalizeVitalsPayload(vitalsForm));
      setVitalsOpen(false);
      setSuccess("Vitals saved");
      await loadVitals();
    } catch (e) {
      setError(e.message || "Failed to save vitals");
    }
  }

  async function handleComplete() {
    if (!window.confirm("Mark this visit as completed?")) return;

    setError("");
    setSuccess("");
    try {
      await completeVisit(token, visitId);
      setSuccess("Visit completed");
      await loadVisit();
    } catch (e) {
      setError(e.message || "Failed to complete visit");
    }
  }

  const vitalsColumns = useMemo(
    () => [
      {
        field: "recordedAt",
        headerName: "Recorded At",
        width: 200,
        renderCell: (params) => {
          const dt = params.value ? new Date(params.value) : null;
          return <span>{dt ? dt.toLocaleString() : "-"}</span>;
        },
      },
      { field: "recordedByName", headerName: "Recorded By", width: 160 },
      {
        field: "bp",
        headerName: "BP",
        width: 120,
        renderCell: (params) => {
          const row = params.row || {};
          return row.bpSystolic != null && row.bpDiastolic != null
            ? `${row.bpSystolic}/${row.bpDiastolic}`
            : "-";
        },
      },
      { field: "temperatureC", headerName: "Temp (°C)", width: 120 },
      { field: "pulse", headerName: "Pulse", width: 100 },
      { field: "spo2", headerName: "SpO₂", width: 90 },
      { field: "heightCm", headerName: "Height (cm)", width: 120 },
      { field: "weightKg", headerName: "Weight (kg)", width: 120 },
    ],
    []
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Typography variant="h5">Visit Details</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleComplete}
            disabled={!visit || isReadOnly}
          >
            Complete Visit
          </Button>
        </Box>
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

      {/* Summary */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ display: "grid", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              OP No: {visit?.patientOpNumber || "-"}
            </Typography>
            <Chip
              size="small"
              label={visit?.status || "—"}
              color={
                visit?.status === "CHECKED_IN"
                  ? "primary"
                  : visit?.status === "IN_PROGRESS"
                  ? "warning"
                  : visit?.status === "COMPLETED"
                  ? "success"
                  : "default"
              }
            />
            {isReadOnly && (
              <Chip size="small" label="Read-only" variant="outlined" />
            )}
          </Box>

          <Typography variant="body2">
            <b>Patient:</b> {visit?.patientName || "-"} | <b>Phone:</b>{" "}
            {visit?.patientPhone || "-"} | <b>DOB:</b>{" "}
            {visit?.patientDob || "-"} | <b>Gender:</b>{" "}
            {visit?.patientGender || "-"}
          </Typography>

          <Typography variant="body2">
            <b>Department:</b> {visit?.departmentName || "-"} | <b>Doctor:</b>{" "}
            {visit?.doctorName || "-"}
          </Typography>

          <Typography variant="body2">
            <b>Checked-in:</b>{" "}
            {visit?.checkInAt
              ? new Date(visit.checkInAt).toLocaleString()
              : "-"}{" "}
            | <b>Completed:</b>{" "}
            {visit?.completedAt
              ? new Date(visit.completedAt).toLocaleString()
              : "-"}
          </Typography>
        </CardContent>
      </Card>

      {/* Vitals */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h6">Vitals</Typography>
            <Button
              variant="contained"
              onClick={openVitalsDialog}
              disabled={isReadOnly}
            >
              Add Vitals
            </Button>
          </Box>

          <Box sx={{ height: 320 }}>
            <DataGrid
              rows={vitals}
              columns={vitalsColumns}
              getRowId={(row) => row.id}
              loading={vitalsLoading}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Placeholders */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Diagnosis (Coming soon)
          </Typography>
          <TextField
            label="Doctor notes / Diagnosis"
            multiline
            minRows={3}
            fullWidth
            disabled
            placeholder="This section will be implemented in the next phase."
          />
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Lab Orders (Coming soon)
          </Typography>
          <Button variant="outlined" disabled>
            Order Lab Test
          </Button>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Lab ordering workflow will be enabled in a later phase.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Prescription (Coming soon)
          </Typography>
          <Button variant="outlined" disabled>
            Prescribe Medicines
          </Button>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Prescription module will be implemented later.
          </Typography>
        </CardContent>
      </Card>

      {/* Vitals Dialog */}
      <Dialog
        open={vitalsOpen}
        onClose={() => setVitalsOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Vitals</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField
            label="Height (cm)"
            value={vitalsForm.heightCm}
            onChange={(e) =>
              setVitalsForm((p) => ({ ...p, heightCm: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Weight (kg)"
            value={vitalsForm.weightKg}
            onChange={(e) =>
              setVitalsForm((p) => ({ ...p, weightKg: e.target.value }))
            }
            fullWidth
          />
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="BP Systolic"
              value={vitalsForm.bpSystolic}
              onChange={(e) =>
                setVitalsForm((p) => ({ ...p, bpSystolic: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="BP Diastolic"
              value={vitalsForm.bpDiastolic}
              onChange={(e) =>
                setVitalsForm((p) => ({ ...p, bpDiastolic: e.target.value }))
              }
              fullWidth
            />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Temperature (°C)"
              value={vitalsForm.temperatureC}
              onChange={(e) =>
                setVitalsForm((p) => ({ ...p, temperatureC: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Pulse"
              value={vitalsForm.pulse}
              onChange={(e) =>
                setVitalsForm((p) => ({ ...p, pulse: e.target.value }))
              }
              fullWidth
            />
          </Box>
          <TextField
            label="SpO₂"
            value={vitalsForm.spo2}
            onChange={(e) =>
              setVitalsForm((p) => ({ ...p, spo2: e.target.value }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVitalsOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={submitVitals}
            disabled={isReadOnly}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
