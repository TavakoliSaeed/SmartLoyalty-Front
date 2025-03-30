"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import useFetch from "@/services/api/use-fetch";
import { API_URL } from "@/services/api/config";
import wrapperFetchJsonResponse from "@/services/api/wrapper-fetch-json-response";

function SecondRegisterPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchBase = useFetch();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!code) return;

    setLoading(true);
    setError("");

    try {
      await fetchBase(`${API_URL}/user/code/second-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      }).then(wrapperFetchJsonResponse);

      router.push("/registration");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
        Second Registration
      </Typography>

      <TextField
        fullWidth
        label="Enter Code"
        variant="outlined"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ mb: 2 }}
      />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        Submit
      </Button>
    </Container>
  );
}

export default withPageRequiredAuth(SecondRegisterPage);
