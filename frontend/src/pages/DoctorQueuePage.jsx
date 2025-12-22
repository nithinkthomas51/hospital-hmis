import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Container,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { fetchDoctorVisits } from "../api/doctorVisitsApi";
import { VISIT_STATUS } from "../constants/visitStatus";
import { HomeButton } from "../components/HomeButton";
import { ROUTES } from "../constants/routes";

export default function DoctorQueuePage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  //   const [date, setDate] = useState("");
  const [filters, setFilters] = useState({
    date: "",
    status: "CHECKED_IN",
  });
  const isFetchingRef = useRef(false);
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  //   async function loadQueue(nextFilter) {
  //     if (isFetchingRef.current) return;

  //     const effectiveFilter = nextFilter || filtersRef.current;

  //     isFetchingRef.current = true;
  //     setLoading(true);
  //     setError("");
  //     try {
  //       const data = await fetchDoctorVisits(token, effectiveFilter);
  //       setQueue(Array.isArray(data) ? data : []);
  //     } catch (e) {
  //       setError(e.message || "Failed to load queue");
  //     } finally {
  //       setLoading(false);
  //       isFetchingRef.current = false;
  //     }
  //   }

  async function loadQueue(nextFilters) {
    if (isFetchingRef.current) return;

    const effectiveFilters = nextFilters || filtersRef.current;

    isFetchingRef.current = true;
    setLoading(true);
    setError("");
    try {
      const data = await fetchDoctorVisits(token, effectiveFilters);
      setQueue(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load visits");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }

  useEffect(() => {
    loadQueue();
    const intervalId = setInterval(() => {
      loadQueue();
    }, 5000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(
    () => [
      { field: "patientOpNumber", headerName: "OP No", width: 110 },
      { field: "patientName", headerName: "Patient", width: 200 },
      { field: "patientPhone", headerName: "Phone", width: 140 },
      { field: "departmentName", headerName: "Department", width: 150 },
      {
        field: "status",
        headerName: "Status",
        width: 140,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value}
            color={
              params.value === "CHECKED_IN"
                ? "primary"
                : params.value === "IN_PROGRESS"
                ? "warning"
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
            variant="contained"
            onClick={() => navigate(`/doctor/visits/${params.row.id}`)}
          >
            Open
          </Button>
        ),
      },
    ],
    [navigate]
  );

  return (
    <Box sx={{ p: 2 }}>
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          padding: 1,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Doctor — My OPD Worklist
        </Typography>
        <HomeButton route={ROUTES.DOCTOR_HOME} />
      </Container>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Date"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={filters.date}
          onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) =>
              setFilters((p) => ({ ...p, status: e.target.value }))
            }
          >
            {VISIT_STATUS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={() => loadQueue(filters)}
          disabled={loading}
        >
          Apply
        </Button>

        <Button
          variant="text"
          onClick={() => {
            setFilters({ date: "", status: "CHECKED_IN" });
            setTimeout(loadQueue, 0);
          }}
        >
          Reset
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
