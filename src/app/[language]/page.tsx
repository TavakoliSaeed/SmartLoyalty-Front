import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import HomeAuthActions from "@/components/home-auth-actions/home-auth-actions";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "common");

  return {
    title: t("app-name"),
  };
}

export default async function Home(props: Props) {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "common");

  return (
    <Container maxWidth="md">
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          height: "90vh",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" data-testid="home-title" gutterBottom>
          {t("app-name")}
        </Typography>

        <HomeAuthActions />
      </Stack>
    </Container>
  );
}
