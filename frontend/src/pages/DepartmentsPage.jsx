import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import TopBar from "../components/TopBar";
import {
  createDepartment,
  deactivateDepartment,
  listDepartments,
  updateDepartment,
} from "../api/departmentsApi";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const load = async () => {
    setError("");
    const onlyActive = !showInactive;
    const data = await listDepartments(onlyActive);
    setDepartments(data);
  };

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [showInactive]);

  const handleCreate = async () => {
    setError("");
    setInfo("");
    try {
      await createDepartment(name.trim(), description.trim());
      setName("");
      setDescription("");
      setInfo("Department Created");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleToggleActive = async (dept) => {
    setError("");
    setInfo("");
    try {
      await updateDepartment(dept.id, { active: !dept.active });
      setInfo(dept.active ? "Department deactivated" : "Department activated");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const openEdit = (dept) => {
    setEditingDept(dept);
    setEditName(dept.name || "");
    setEditDescription(dept.description || "");
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditingDept(null);
    setEditName("");
    setEditDescription("");
  };

  const savedEdit = async () => {
    if (!editingDept) return;
    setError("");
    setInfo("");
    try {
      await updateDepartment(editingDept.id, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      setInfo("Department updated");
      closeEdit();
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeactivate = async (id) => {
    setError("");
    setInfo("");
    try {
      await deactivateDepartment(id);
      setInfo("Department deactivated");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <TopBar title="Departments" />
      <Container sx={{ mt: 3 }}>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3,
            padding: 1,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create Department
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              component={Link}
              to={ROUTES.ADMIN_HOME}
              sx={{ marginLeft: "auto" }}
            >
              Admin Home
            </Button>
          </Box>
        </Container>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {info && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {info}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Department Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Add
          </Button>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
          }
          label="Show inactive departments"
          sx={{ mb: 2 }}
        />
        <Typography variant="h6" sx={{ mb: 1 }}>
          {showInactive ? "All Departments" : "Active Departments"}
        </Typography>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                {showInactive && <TableCell>Status</TableCell>}
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {departments.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.description}</TableCell>
                  {showInactive && (
                    <TableCell>{d.active ? "Active" : "Inactive"}</TableCell>
                  )}
                  <TableCell align="right">
                    <Button onClick={() => openEdit(d)} sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button
                      color={d.active ? "error" : "success"}
                      onClick={() => handleToggleActive(d)}
                    >
                      {d.active ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {departments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>No Departments Found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        <Dialog open={editOpen} onClose={closeEdit} fullWidth maxWidth="sm">
          <DialogTitle>Edit Department</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEdit}>Cancel</Button>
            <Button
              variant="contained"
              onClick={savedEdit}
              disabled={!editName.trim()}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
