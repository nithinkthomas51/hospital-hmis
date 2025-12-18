import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  Alert,
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
  Menu,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";
import {
  listStaff,
  createStaff,
  updateStaff,
  deactivateStaff,
  activateStaff,
} from "../api/staffApi";
import { listDepartments } from "../api/departmentsApi";
import { AdminHomeButton } from "../components/AdminHomeButton";

const emptyCreateForm = {
  username: "",
  email: "",
  password: "",
  roles: [ROLES.DOCTOR],
  departmentId: "",
  firstName: "",
  lastName: "",
  phone: "",
  designation: "",
};

const emptyEditForm = {
  departmentId: "",
  firstName: "",
  lastName: "",
  phone: "",
  designation: "",
};

export default function staffDashboardPage() {
  const { token } = useAuth();

  const [onlyActive, setOnlyActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [createForm, setCreateForm] = useState({ ...emptyCreateForm });
  const [editForm, setEditForm] = useState({ ...emptyEditForm });
  const [selectedStaff, setSelectedStaff] = useState(null);

  const deptOptions = useMemo(() => {
    return departments.filter((d) => d.active === true);
  }, [departments]);

  async function refresh() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      console.log(`OnlyActive Value: ${onlyActive}`);
      const [staffData, deptData] = await Promise.all([
        listStaff(token, onlyActive),
        listDepartments(true),
      ]);
      setStaff(Array.isArray(staffData) ? staffData : []);
      setDepartments(Array.isArray(deptData) ? deptData : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [onlyActive]);

  function openCreate() {
    setError("");
    setSuccess("");
    setCreateForm({
      ...emptyCreateForm,
      departmentId: deptOptions[0]?.id ?? "",
    });
    setCreateOpen(true);
  }

  function openEdit(row) {
    setError("");
    setSuccess("");
    setSelectedStaff(row);
    setEditForm({
      departmentId: row.departmentId,
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      phone: row.phone || "",
      designation: row.designation || "",
    });
    setEditOpen(true);
  }

  async function onCreateSubmit() {
    setError("");
    setSuccess("");

    try {
      if (!createForm.departmentId)
        throw new Error("Please select a department");

      await createStaff(token, {
        username: createForm.username.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        roles: createForm.roles,
        departmentId: Number(createForm.departmentId),
        firstName: createForm.firstName.trim(),
        lastName: createForm.lastName.trim(),
        phone: createForm.phone.trim() || null,
        designation: createForm.designation.trim() || null,
      });

      setCreateOpen(false);
      setSuccess("Staff created successfully");
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to create staff");
    }
  }

  async function onEditSubmit() {
    setError("");
    setSuccess("");
    try {
      if (!selectedStaff?.id) throw new Error("No staff selected.");
      if (!editForm.departmentId)
        throw new Error("Please select a department.");
      await updateStaff(token, selectedStaff.id, {
        departmentId: Number(editForm.departmentId),
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        phone: editForm.phone.trim() || null,
        designation: editForm.designation.trim() || null,
      });
      setEditOpen(false);
      setSuccess("Staff updated successfully");
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to update staff");
    }
  }

  async function toggleActive(row) {
    setError("");
    setSuccess("");
    try {
      if (row.active) {
        await deactivateStaff(token, row.id);
        setSuccess("Staff deactivated");
      } else {
        await activateStaff(token, row.id);
        setSuccess("Staff activated");
      }
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to update status");
    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "username", headerName: "Username", width: 140 },
    { field: "email", headerName: "Email", width: 220 },
    {
      field: "name",
      headerName: "Name",
      width: 170,
      valueGetter: (_, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`.trim(),
    },
    { field: "departmentName", headerName: "Department", width: 160 },
    {
      field: "roles",
      headerName: "Roles",
      width: 180,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            flexWrap: "wrap",
            alignItems: "flex-start",
            paddingTop: "14px",
          }}
        >
          {(params.value || []).map((r) => (
            <Chip key={r} label={r} size="small" />
          ))}
        </Box>
      ),
      sortable: false,
    },
    { field: "designation", headerName: "Designation", width: 200 },
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
      width: 260,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-start",
            paddingTop: "10px",
          }}
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
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">Staff Dashboard</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Show Inactive</Typography>
            <Switch
              checked={!onlyActive}
              onChange={(e) => setOnlyActive(!e.target.checked)}
            />
          </Box>
          <Button variant="contained" onClick={openCreate}>
            Create Staff
          </Button>
          <AdminHomeButton />
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
      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={staff}
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
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Staff</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          {/* username */}
          <TextField
            label="Username"
            value={createForm.username}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, username: e.target.value }))
            }
            fullwidth
          />
          {/* Email */}
          <TextField
            label="Email"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, email: e.target.value }))
            }
            fullwidth
          />
          {/* Password */}
          <TextField
            label="Password"
            type="password"
            value={createForm.password}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, password: e.target.value }))
            }
            fullwidth
          />
          {/* Role selector */}
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={createForm.roles[0] || ""}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, roles: [e.target.value] }))
              }
            >
              {Object.keys(ROLES).map((r) =>
                r !== ROLES.ADMIN ? (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ) : null
              )}
            </Select>
          </FormControl>
          {/* Department Selector */}
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              label="Department"
              value={createForm.departmentId}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, departmentId: e.target.value }))
              }
            >
              {deptOptions.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* First Name */}
          <TextField
            label="First Name"
            value={createForm.firstName}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, firstName: e.target.value }))
            }
            fullWidth
          />
          {/* Last name */}
          <TextField
            label="Last Name"
            value={createForm.lastName}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, lastName: e.target.value }))
            }
            fullWidth
          />
          {/* Phone */}
          <TextField
            label="Phone (optional)"
            value={createForm.phone}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, phone: e.target.value }))
            }
            fullWidth
          />
          {/*  Designation  */}
          <TextField
            label="Designation (optional)"
            value={createForm.designation}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, designation: e.target.value }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={onCreateSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Staff</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              label="Department"
              value={editForm.departmentId}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, departmentId: e.target.value }))
              }
            >
              {deptOptions.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* First Name for edit */}
          <TextField
            label="First Name"
            value={editForm.firstName}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, firstName: e.target.value }))
            }
            fullWidth
          />
          {/* Last name for edit */}
          <TextField
            label="Last Name"
            value={editForm.lastName}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, lastName: e.target.value }))
            }
            fullWidth
          />
          {/* Phone for edit */}
          <TextField
            label="Phone (optional)"
            value={editForm.phone}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, phone: e.target.value }))
            }
            fullWidth
          />
          {/* Designation for edit */}
          <TextField
            label="Designation (optional)"
            value={editForm.designation}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, designation: e.target.value }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={onEditSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
