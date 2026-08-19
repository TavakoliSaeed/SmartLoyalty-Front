"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "@/components/link";
import Box from "@mui/material/Box";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import {
  Registration,
  useGetRegistrationsService,
} from "@/services/api/services/registrations";
import { useAuthGetMeService } from "@/services/api/services/auth";
import { User } from "@/services/api/types/user";
import { useTranslation } from "@/services/i18n/client";

function RegistrationsPage() {
  const { t } = useTranslation("registration");
  const fetchRegistrations = useGetRegistrationsService();
  const fetchMe = useAuthGetMeService();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await fetchRegistrations();
        setRegistrations(data as Registration[]);

        const userResponse = await fetchMe();
        setScore((userResponse.data as User)?.score);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [fetchRegistrations, fetchMe]);

  return (
      <Container maxWidth="lg">
          <Box
              sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
                  mb: 2
              }}>
            <Typography variant="h4">{t("title")}</Typography>
            {score !== null && (
                <Typography variant="h6">
                  {t("totalScore")}: {score}
                </Typography>
            )}
          </Box>

          <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/registration/add"
              sx={{ mb: 2 }}
          >
            {t("actions.registerAgain")}
          </Button>

          {loading ? (
              <Typography>{t("loading")}</Typography>
          ) : (
              <Box sx={{ width: "100%"}}>
                  <Paper>
                      <Table>
                          <TableHead>
                              <TableRow>
                                  <TableCell align={"center"}>{t("table.identityCode")}</TableCell>
                                  <TableCell align={"center"}>{t("table.score")}</TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {registrations.length > 0 &&
                                  registrations.map((reg) => (
                                      <TableRow key={reg.ID}>
                                          <TableCell align={"center"}>{reg.code?.IdentityCode}</TableCell>
                                          <TableCell align={"center"}>{reg.code?.Score}</TableCell>
                                      </TableRow>
                                  ))}
                          </TableBody>
                      </Table>
                  </Paper>
              </Box>
          )}
      </Container>
  );
}

export default withPageRequiredAuth(RegistrationsPage);
