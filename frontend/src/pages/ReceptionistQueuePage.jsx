import React, { useEffect, useState } from "react";
import {
  Alert,
  Select,
  MenuItem,
  Box,
  Button,
  Chip,
  InputLabel,
  TextField,
  Typography,
  FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { useAuth } from "../context/AuthContext";
import { fetchReceptionQueue, cancelVisit } from "../api/visitsApi";
import { VISIT_STATUS } from "../constants/visitStatus";

export default function ReceptionQueuePage() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [filters, setFilters] = useState({
    date: "", // YYYY-MM-DD (optional)
    status: "CHECKED_IN",
    doctorId: "",
    departmentId: "",
  });

  async function loadQueue() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchReceptionQueue(token, filters);
      setQueue(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function handleCancel(row) {
    if (!window.confirm("Cancel this visit?")) return;

    try {
      await cancelVisit(token, row.id);
      setSuccess("Visit cancelled");
      await loadQueue();
    } catch (e) {
      setError(e.message || "Failed to cancel visit");
    }
  }

  const columns = [
    { field: "patientOpNumber", headerName: "OP No", width: 110 },
    { field: "patientName", headerName: "Patient", width: 180 },
    { field: "patientPhone", headerName: "Phone", width: 140 },
    { field: "departmentName", headerName: "Department", width: 150 },
    { field: "doctorName", headerName: "Doctor", width: 180 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={
            params.value === "CHECKED_IN"
              ? "primary"
              : params.value === "COMPLETED"
              ? "success"
              : "default"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => handleCancel(params.row)}
          disabled={params.row.status === "COMPLETED"}
        >
          Cancel
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Reception — OPD Queue
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Date"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={filters.date}
          onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))}
        />

        {/* <TextField
          label="Status"
          value={filters.status}
          onChange={(e) =>
            setFilters((p) => ({ ...p, status: e.target.value }))
          }
          placeholder="CHECKED_IN"
        /> */}
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) =>
              setFilters((p) => ({ ...p, status: e.target.value }))
            }
          >
            {VISIT_STATUS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Doctor ID"
          value={filters.doctorId}
          onChange={(e) =>
            setFilters((p) => ({ ...p, doctorId: e.target.value }))
          }
        />

        <TextField
          label="Department ID"
          value={filters.departmentId}
          onChange={(e) =>
            setFilters((p) => ({ ...p, departmentId: e.target.value }))
          }
        />

        <Button variant="outlined" onClick={loadQueue}>
          Apply
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

      <Box sx={{ height: 550 }}>
        <DataGrid
          rows={queue}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </Box>
    </Box>
  );
}
