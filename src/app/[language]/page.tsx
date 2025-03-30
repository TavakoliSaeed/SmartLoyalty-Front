import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

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
      <Grid
        container
        spacing={3}
        wrap="nowrap"
        pt={3}
        direction="column"
        sx={{ height: "90vh", alignItems: "center" }}
      >
        {/*<Grid size="grow">*/}
        <Typography variant="h3" data-testid="home-title" gutterBottom>
          {t("app-name")}
        </Typography>
        {/*<Typography>*/}
        {/*  <Trans*/}
        {/*    i18nKey={`description`}*/}
        {/*    t={t}*/}
        {/*    components={[*/}
        {/*      <MuiLink*/}
        {/*        key="1"*/}
        {/*        target="_blank"*/}
        {/*        rel="noopener noreferrer"*/}
        {/*        href="https://github.com/brocoders/extensive-react-boilerplate/blob/main/docs/README.md"*/}
        {/*      >*/}
        {/*        {}*/}
        {/*      </MuiLink>,*/}
        {/*    ]}*/}
        {/*  />*/}
        {/*</Typography>*/}
        {/*</Grid>*/}
        {/*<Grid sx={{ mx: "auto" }}>*/}
        {/*  <MuiLink href="/privacy-policy">Privacy Policy</MuiLink>*/}
        {/*</Grid>*/}
      </Grid>
    </Container>
  );
}
