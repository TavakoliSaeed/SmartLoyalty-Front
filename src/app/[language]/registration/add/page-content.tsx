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
import { useTranslation } from "@/services/i18n/client";

function SecondRegisterPage() {
  const { t } = useTranslation("registration");
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
      setError(err.message || t("secondRegister.errors.default"));
    } finally {
      setLoading(false);
    }
  };

  return (
      <Container maxWidth="sm">
        <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
          {t("secondRegister.title")}
        </Typography>

        <TextField
            fullWidth
            label={t("secondRegister.inputs.code.label")}
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
          {t("secondRegister.actions.submit")}
        </Button>
      </Container>
  );
}

export default withPageRequiredAuth(SecondRegisterPage);
