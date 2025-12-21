import React, { useEffect, useMemo, useState } from "react";
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
import { DataGrid, FilterPanelTrigger } from "@mui/x-data-grid";

import { useAuth } from "../context/AuthContext";
import { SHIFT_TYPES } from "../constants/shiftTypes";
import { listDepartments } from "../api/departmentsApi";
import { listStaff } from "../api/staffApi";
import {
  listSchedules,
  createSchedule,
  updateSchedule,
  activateSchedule,
  deactivateSchedule,
} from "../api/schedulesApi";

function toLocalInputValue(isoInstant) {
  const d = new Date(isoInstant);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function localInputToIso(localValue) {
  return new Date(localValue).toISOString();
}

const emptyCreate = {
  departmentId: "",
  staffId: "",
  startAtLocal: "",
  endAtLocal: "",
  shiftType: "MORNING",
  notes: "",
};

const emptyEdit = {
  startAtLocal: "",
  endAtLocal: "",
  shiftType: "MORNING",
  notes: "",
};

export default function SchedulesDashboardPage() {
  const { token } = useAuth();

  const [onlyActive, setOnlyActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [createForm, setCreateForm] = useState({ ...emptyCreate });
  const [editForm, setEditForm] = useState({ ...emptyEdit });
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [filterDepartmentId, setFilterDepartmentId] = useState("");
  const [filterStaffId, setFilterStaffId] = useState("");

  const activeDepartments = useMemo(
    () => departments.filter((d) => d.active === true),
    [departments]
  );

  const staffForSelectedDept = useMemo(() => {
    const deptId = Number(createForm.departmentId || filterDepartmentId || 0);
    if (!deptId) return staff.filter((s) => s.active === true);
    return staff.filter((s) => s.active === true && s.departmentId === deptId);
  }, [staff, createForm.departmentId, filterDepartmentId]);

  const filteredSchedules = useMemo(() => {
    let rows = [...schedules];
    if (filterDepartmentId) {
      const deptId = Number(filterDepartmentId);
      rows = rows.filter((r) => r.departmentId === deptId);
    }
    if (filterStaffId) {
      const sid = Number(filterStaffId);
      rows = rows.filter((r) => r.staffId === sid);
    }
    return rows;
  }, [schedules, filterDepartmentId, filterStaffId]);

  async function refresh() {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const [deptData, staffData, schedData] = await Promise.all([
        listDepartments(true),
        listStaff(token, true),
        listSchedules(token, onlyActive),
      ]);
      setDepartments(Array.isArray(deptData) ? deptData : []);
      setStaff(Array.isArray(staffData) ? staffData : []);
      setSchedules(Array.isArray(schedData) ? schedData : []);
    } catch (e) {
      setError(e.message || "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyActive]);

  function openCreateDialog() {
    setError("");
    setSuccess("");
    const defaultDept = activeDepartments[0]?.id ?? "";
    setCreateForm({
      ...emptyCreate,
      departmentId: defaultDept,
      staffId: "",
    });
    setCreateOpen(true);
  }

  function openEditDialog(row) {
    setError("");
    setSuccess("");
    setSelectedSchedule(row);
    setEditForm({
      startAtLocal: toLocalInputValue(row.startAt),
      endAtLocal: toLocalInputValue(row.endAt),
      shiftType: row.shiftType || "MORNING",
      notes: row.notes || "",
    });
    setEditOpen(true);
  }

  async function submitCreate() {
    setError("");
    setSuccess("");

    try {
      if (!createForm.departmentId)
        throw new Error("Please select a department");
      if (!createForm.staffId) throw new Error("Please select a staff member");
      if (!createForm.startAtLocal || !createForm.endAtLocal)
        throw new Error("Please enter start and end time");

      const startIso = localInputToIso(createForm.startAtLocal);
      const endIso = localInputToIso(createForm.endAtLocal);

      if (new Date(startIso) >= new Date(endIso))
        throw new Error("Start time must be before end time");
      await createSchedule(token, {
        staffId: Number(createForm.staffId),
        startAt: startIso,
        endAt: endIso,
        shiftType: createForm.shiftType,
        notes: createForm.notes.trim() || null,
      });

      setCreateOpen(false);
      setSuccess("Schedule created");
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to create schedule");
    }
  }

  async function submitEdit() {
    setError("");
    setSuccess("");

    try {
      if (!selectedSchedule?.id) throw new Error("No schedule selected");
      if (!editForm.startAtLocal || !editForm.endAtLocal)
        throw new Error("Please enter start and end time");

      const startIso = localInputToIso(editForm.startAtLocal);
      const endIso = localInputToIso(editForm.endAtLocal);

      if (new Date(startIso) >= new Date(endIso))
        throw new Error("Start time must be before end time");

      await updateSchedule(token, selectedSchedule.id, {
        startAt: startIso,
        endAt: endIso,
        shiftType: editForm.shiftType,
        notes: editForm.notes.trim() || null,
      });
      setEditOpen(false);
      setSuccess("Schedule updated");
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to update schedule");
    }
  }

  async function toggleActive(row) {
    setError("");
    setSuccess("");
    try {
      if (row.active) {
        await deactivateSchedule(token, row.id);
        setSuccess("Schedule deactivated");
      } else {
        await activateSchedule(token, row.id);
        setSuccess("Schedule activated");
      }
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to update schedule status");
    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "staffName",
      headerName: "Staff",
      width: 170,
    },
    { field: "username", headerName: "Username", width: 140 },
    { field: "departmentName", headerName: "Department", width: 160 },
    {
      field: "startAt",
      headerName: "Start",
      width: 190,
      valueFormatter: (v) => new Date(v).toLocaleString(),
    },
    {
      field: "endAt",
      headerName: "End",
      width: 190,
      valueFormatter: (v) => new Date(v).toLocaleString(),
    },
    {
      field: "shiftType",
      headerName: "Shift",
      width: 120,
      renderCell: (params) => <Chip label={params.value} size="small" />,
    },
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
            onClick={() => openEditDialog(params.row)}
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
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">Schedules Dashboard</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Show Inactive</Typography>
            <Switch
              checked={!onlyActive}
              onChange={(e) => setOnlyActive(!e.target.checked)}
            />
          </Box>
          <Button variant="contained" onClick={openCreateDialog}>
            Create Schedule
          </Button>
        </Box>
      </Box>
      {/* filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Filter Department</InputLabel>
          <Select
            label="Filter Department"
            value={filterDepartmentId}
            onChange={(e) => {
              setFilterDepartmentId(e.target.value);
              setFilterStaffId("");
            }}
          >
            <MenuItem value="">All</MenuItem>
            {activeDepartments.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Filter Staff</InputLabel>
          <Select
            label="Filter Staff"
            value={filterStaffId}
            onChange={(e) => setFilterStaffId(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {(filterDepartmentId
              ? staff.filter(
                  (s) =>
                    s.active === true &&
                    s.departmentId === Number(filterDepartmentId)
                )
              : staff.filter((s) => s.active === true)
            ).map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.firstName} {s.lastName} {s.userName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

      <Box sx={{ height: 540, width: "100%" }}>
        <DataGrid
          rows={filteredSchedules}
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

      {/* Create Dialog box */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Schedule</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              label="Department"
              value={createForm.departmentId}
              onChange={(e) =>
                setCreateForm((p) => ({
                  ...p,
                  departmentId: e.target.value,
                  staffId: "",
                }))
              }
            >
              {activeDepartments.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Staff</InputLabel>
            <Select
              label="Staff"
              value={createForm.staffId}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, staffId: e.target.value }))
              }
            >
              {staffForSelectedDept.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.designation})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Start Time"
            type="datetime-local"
            slotProps={{ inputLabel: { shrink: true } }}
            value={createForm.startAtLocal}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, startAtLocal: e.target.value }))
            }
            fullWidth
          />

          <TextField
            label="End Time"
            type="datetime-local"
            slotProps={{ inputLabel: { shrink: true } }}
            value={createForm.endAtLocal}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, endAtLocal: e.target.value }))
            }
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Shift Type</InputLabel>
            <Select
              label="Shift Type"
              value={createForm.shiftType}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, shiftType: e.target.value }))
              }
            >
              {SHIFT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Notes (optional)"
            value={createForm.notes}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, notes: e.target.value }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitCreate}>
            Create
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
        <DialogTitle>Edit Schedule</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField
            label="Start Time"
            type="datetime-local"
            slotProps={{ inputLabel: { shrink: true } }}
            value={editForm.startAtLocal}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, startAtLocal: e.target.value }))
            }
            fullWidth
          />

          <TextField
            label="End Time"
            type="datetime-local"
            slotProps={{ inputLabel: { shrink: true } }}
            value={editForm.endAtLocal}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, endAtLocal: e.target.value }))
            }
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Shift Type</InputLabel>
            <Select
              label="Shift Type"
              value={editForm.shiftType}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, shiftType: e.target.value }))
              }
            >
              {SHIFT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Notes (optional)"
            value={editForm.notes}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, notes: e.target.value }))
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
