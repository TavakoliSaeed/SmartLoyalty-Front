"use client";

import Stack from "@mui/material/Stack";
import FacebookAuth from "./facebook/facebook-auth";
import { isFacebookAuthEnabled } from "./facebook/facebook-config";
import GoogleAuth from "./google/google-auth";
import { isGoogleAuthEnabled } from "./google/google-config";

export default function SocialAuth() {
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      {isGoogleAuthEnabled && <GoogleAuth />}
      {isFacebookAuthEnabled && <FacebookAuth />}
    </Stack>
  );
}
