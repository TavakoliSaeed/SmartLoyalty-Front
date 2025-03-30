"use client";

import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useTranslation } from "@/services/i18n/client";

function Profile() {
  const { user } = useAuth();
  const { t } = useTranslation("profile");

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          {t("title")}
        </Typography>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">
                {t("fields.store_name")}
              </Typography>
              <Typography variant="body1">{user?.store_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">
                {t("fields.owner_name")}
              </Typography>
              <Typography variant="body1">{user?.owner_name}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">{t("fields.email")}</Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">
                {t("fields.username")}
              </Typography>
              <Typography variant="body1">{user?.username}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">{t("fields.mobile")}</Typography>
              <Typography variant="body1">{user?.mobile}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">
                {t("fields.landline")}
              </Typography>
              <Typography variant="body1">{user?.landline}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2">{t("fields.address")}</Typography>
              <Typography variant="body1">{user?.address}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">
                {t("fields.postal_code")}
              </Typography>
              <Typography variant="body1">{user?.postal_code}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">{t("fields.status")}</Typography>
              <Typography variant="body1">{user?.status}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                {t("fields.score")}: {user?.score}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

export default withPageRequiredAuth(Profile);
