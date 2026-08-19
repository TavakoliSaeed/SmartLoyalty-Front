"use client";

import { Button, Box } from "@mui/material";
import useAuth from "@/services/auth/use-auth";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";

export default function HomeAuthActions() {
    const { user, isLoaded } = useAuth();
    const { t } = useTranslation("common");

    if (!isLoaded || user) return null;

    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                mt: 3
            }}>
            <Button variant="contained" color="primary" component={Link} href="/sign-in">
                {t("common:navigation.signIn")}
            </Button>
            {IS_SIGN_UP_ENABLED && (
                <Button variant="outlined" color="primary" component={Link} href="/sign-up">
                    {t("common:navigation.signUp")}
                </Button>
            )}
        </Box>
    );
}
