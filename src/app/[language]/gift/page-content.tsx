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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import {
  GiftRequestResponse,
  useGetGiftsService,
  useRequestNewGiftService,
} from "@/services/api/services/gifts";
import { useRouter } from "next/navigation";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import Box from "@mui/material/Box";

export type Gift = {
  ID: number;
  Code: string;
  Name: string;
  RequiredScore: number;
};

function GiftListPage() {
  const fetchGifts = useGetGiftsService();
  const requestGift = useRequestNewGiftService();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation("gift");
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await fetchGifts();
        setGifts(data as Gift[]);
      } catch (error) {
        console.error("Error fetching gifts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [fetchGifts]);

  const handleRequest = async (giftId: number) => {
    try {
      const { status, data } = await requestGift({ gift_id: giftId });
      if (status === 200) {
        setOpenDialog(true);
      } else if ((status as number) === HTTP_CODES_ENUM.BAD_REQUEST) {
        setErrorMessage(
            t(`toast.${(data as GiftRequestResponse)?.error}`) ||
            (data as GiftRequestResponse)?.error
        );
      }
    } catch (error: any) {
      setErrorMessage(error?.message || t("toast.error"));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    router.push("/registration");
  };

  const handleCloseToast = () => {
    setErrorMessage(null);
  };

  return (
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
          {t("title")}
        </Typography>

        {loading ? (
            <Typography>{t("loading")}</Typography>
        ) : (
            <Paper>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Table sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("table.id")}</TableCell>
                      <TableCell>{t("table.code")}</TableCell>
                      <TableCell>{t("table.name")}</TableCell>
                      <TableCell>{t("table.requiredScore")}</TableCell>
                      <TableCell>{t("table.actions")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gifts.map((gift) => (
                        <TableRow key={gift.ID}>
                          <TableCell>{gift.ID}</TableCell>
                          <TableCell>{gift.Code}</TableCell>
                          <TableCell>{gift.Name}</TableCell>
                          <TableCell>{gift.RequiredScore}</TableCell>
                          <TableCell>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleRequest(gift.ID)}
                            >
                              {t("table.request")}
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{t("dialog.successTitle")}</DialogTitle>
          <DialogContent>
            <Typography>{t("dialog.successMessage")}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} autoFocus>
              {t("dialog.ok")}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
            open={!!errorMessage}
            autoHideDuration={6000}
            onClose={handleCloseToast}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
              onClose={handleCloseToast}
              severity="error"
              sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
  );
}

export default withPageRequiredAuth(GiftListPage);
