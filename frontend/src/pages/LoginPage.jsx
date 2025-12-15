import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { loginRequest } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginRequest(username, password);
      login(data.token, data.username, data.roles);

      const roles = data.roles || [];
      if (roles.some((r) => r.includes("ADMIN"))) {
        navigate("/admin");
      } else if (roles.some((r) => r.includes("DOCTOR"))) {
        navigate("/doctor");
      } else if (roles.some((r) => r.includes("RECEPTIONIST"))) {
        navigate("/receptionist");
      } else if (roles.some((r) => r.includes("PHARMACIST"))) {
        navigate("/pharmacy");
      } else if (roles.some((r) => r.includes("TECHNICIAN"))) {
        navigate("/lab");
      } else if (roles.some((r) => r.includes("PATIENT"))) {
        navigate("/patient");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" textAlign="center">
          HMIS Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
