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
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import { useGetMyGiftRequestsService } from "@/services/api/services/gifts";
import Box from "@mui/material/Box";

export type MyGiftRequest = {
  ID: number;
  GiftID: number;
  GiftCode: string;
  GiftName: string;
  FinalSellerID: number;
  Status: string;
  CreatedAt: string;
};

function MyGiftRequestsPage() {
  const fetchGiftRequests = useGetMyGiftRequestsService();
  const [requests, setRequests] = useState<MyGiftRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("my-gift");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await fetchGiftRequests();
        setRequests(data as MyGiftRequest[]);
      } catch (error) {
        console.error("Error fetching gift requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [fetchGiftRequests]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        {t("myGifts.title")}
      </Typography>

      {!loading && (
          <Box sx={{ width: "100%"}}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("myGifts.table.giftName")}</TableCell>
                    <TableCell>{t("myGifts.table.status")}</TableCell>
                    <TableCell>{t("myGifts.table.createdAt")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((req) => (
                      <TableRow key={req.ID}>
                        <TableCell>{req.GiftName}</TableCell>
                        <TableCell>{t(`myGifts.status.${req.Status}`)}</TableCell>
                        <TableCell>
                          {new Date(req.CreatedAt).toLocaleString()}
                        </TableCell>
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

export default withPageRequiredAuth(MyGiftRequestsPage);
