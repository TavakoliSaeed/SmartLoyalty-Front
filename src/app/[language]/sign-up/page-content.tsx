// pages/sign-up.tsx
"use client";

import Button from "@mui/material/Button";
import {withPageRequiredGuestSignUp} from "@/services/auth/with-page-required-guest";
import {FormProvider, useForm, useFormState, useWatch} from "react-hook-form";
import {SendOtpResponse, useAuthSignUpService, useSendOtpService} from "@/services/api/services/auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import useAuthTokens from "@/services/auth/use-auth-tokens";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import Link from "@/components/link";
import Box from "@mui/material/Box";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import {useTranslation} from "@/services/i18n/client";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {fallbackLanguage} from "@/services/i18n/config";
import {useGetProvincesWithCitiesService} from "@/services/api/services/geo";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface Province {
    id: number;
    name: string;
    cities: { id: number; name: string }[];
}

type SignUpFormData = {
    email: string;
    owner_name: string;
    store_name: string;
    landline: string;
    province: number;
    city: number;
    postal_code: string;
    address: string;
    mobile: string;
    otp: string;
};

const useValidationSchema = () => {
    const {t} = useTranslation("sign-up");
    return yup.object().shape({
        email: yup.string().email(t("sign-up:inputs.email.validation.invalid")).required(t("sign-up:inputs.email.validation.required")),
        owner_name: yup.string().required(t("sign-up:inputs.owner_name.validation.required")),
        store_name: yup.string().required(t("sign-up:inputs.store_name.validation.required")),
        landline: yup.string().matches(/^\d+$/, "فقط عدد مجاز است").required(t("sign-up:inputs.landline.validation.required")),
        province: yup.number().required(t("sign-up:inputs.province.validation.required")),
        city: yup.number().required(t("sign-up:inputs.city.validation.required")),
        postal_code: yup.string().matches(/^\d+$/, "فقط عدد مجاز است").required(t("sign-up:inputs.postal_code.validation.required")),
        address: yup.string().required(t("sign-up:inputs.address.validation.required")),
        mobile: yup.string().matches(/^\d+$/, "فقط عدد مجاز است").required(t("sign-up:inputs.mobile.validation.required")),
        otp: yup.string().matches(/^\d+$/, "فقط عدد مجاز است").required("وارد کردن کد تایید الزامی است"),
    });
};

function FormActions() {
    const {t} = useTranslation("sign-up");
    const {isSubmitting} = useFormState();
    return (
        <Button variant="contained" color="primary" type="submit" disabled={isSubmitting} fullWidth>
            {t("sign-up:actions.submit")}
        </Button>
    );
}

function Form() {
    const {setUser} = useAuthActions();
    const {setTokensInfo} = useAuthTokens();
    const fetchAuthSignUp = useAuthSignUpService();
    const {t} = useTranslation("sign-up");
    const [open, setOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const router = useRouter();
    const getProvinces = useGetProvincesWithCitiesService();
    const [provinces, setProvinces] = useState<Province[]>([]);

    const [otpCooldown, setOtpCooldown] = useState(0);
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        getProvinces().then(setProvinces).catch(console.error);
        const stored = localStorage.getItem("otpSentAt");
        if (stored) {
            const diff = 120 - Math.floor((Date.now() - Number(stored)) / 1000);
            if (diff > 0) setOtpCooldown(diff);
        }
    }, []);

    useEffect(() => {
        if (otpCooldown > 0) {
            const interval = setInterval(() => {
                setOtpCooldown((prev) => {
                    if (prev <= 1) {
                        localStorage.removeItem("otpSentAt");
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [otpCooldown]);

    const validationSchema = useValidationSchema();
    const methods = useForm<SignUpFormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: "",
            owner_name: "",
            store_name: "",
            landline: "",
            province: 0,
            city: 0,
            postal_code: "",
            address: "",
            mobile: "",
            otp: "",
        },
    });

    const {handleSubmit, setError, control, getValues} = methods;
    const selectedProvince = useWatch({control, name: "province"});
    const cities = provinces.find((p) => p.id === selectedProvince)?.cities || [];


// Inside Form()
    const sendOtp = useSendOtpService();

    const sendOtpCode = async () => {
        const mobile = getValues("mobile");
        if (!mobile || otpCooldown > 0) return;

        try {
            const {data} = await sendOtp(mobile);
            if ((data as SendOtpResponse)?.sent === "true") {
                localStorage.setItem("otpSentAt", Date.now().toString());
                setOtpCooldown(120);
                setOtpSent(true);
                setToastMessage("کد تایید با موفقیت ارسال شد");
            } else {
                setToastMessage("خطا در ارسال کد تایید");
            }
        } catch (err) {
            console.error("OTP Error:", err);
            setToastMessage("خطا در ارسال کد تایید");
        }
    };


    const handleClose = () => {
        setOpen(false);
        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get("returnTo") ?? `/${fallbackLanguage}`;
        router.replace(returnTo);
    };

    const onSubmit = handleSubmit(async (formData) => {
        if (!otpSent) {
            setToastMessage("ابتدا کد تایید را ارسال و وارد کنید");
            return;
        }
        const {data: dataSignUp, status: statusSignUp} = await fetchAuthSignUp(formData);
        console.log("data",dataSignUp,statusSignUp)
        if (statusSignUp === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
            (Object.keys(dataSignUp.errors) as Array<keyof SignUpFormData>).forEach((key) => {
                setError(key, {
                    type: "manual",
                    message: t(`sign-up:inputs.${key}.validation.server.${dataSignUp.errors[key]}`),
                });
            });
            return;
        }
        if (statusSignUp === HTTP_CODES_ENUM.CREATED) {
            setOpen(true);
        }
    });

    return (
        <FormProvider {...methods}>
            <Container maxWidth="sm">
                <form onSubmit={onSubmit}>
                    <Grid container spacing={2} mb={2}>
                        <Grid size={{xs: 12}} mt={2}><Typography variant="h6"
                                                                 textAlign="center">{t("sign-up:title")}</Typography></Grid>
                        <Grid size={{xs: 12, md: 6}}><FormTextInput name="email" label={t("sign-up:inputs.email.label")}
                                                                    type="email"/></Grid>
                        <Grid size={{xs: 12, md: 6}}><FormTextInput name="store_name"
                                                                    label={t("sign-up:inputs.store_name.label")}/></Grid>
                        <Grid size={{xs: 12, md: 6}}><FormTextInput name="owner_name"
                                                                    label={t("sign-up:inputs.owner_name.label")}/></Grid>
                        <Grid size={{xs: 12, md: 6}}><FormTextInput name="landline"
                                                                    label={t("sign-up:inputs.landline.label")}
                                                                    type="number"/></Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <TextField select fullWidth
                                       label={t("sign-up:inputs.province.label")} {...methods.register("province")}>
                                {provinces.map((prov) => (
                                    <MenuItem key={prov.id} value={prov.id}>{prov.name}</MenuItem>))}
                            </TextField>
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <TextField select fullWidth
                                       label={t("sign-up:inputs.city.label")} {...methods.register("city")}>
                                {cities.map((city) => (<MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>))}
                            </TextField>
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}><FormTextInput name="postal_code"
                                                                    label={t("sign-up:inputs.postal_code.label")}
                                                                    type="number"/></Grid>
                        <Grid size={{xs: 12}}><FormTextInput name="address" label={t("sign-up:inputs.address.label")}/></Grid>

                        <Grid size={{xs: 12}}><FormTextInput name="mobile" label={t("sign-up:inputs.mobile.label")}
                                                             type="number"/></Grid>

                        <Grid size={{xs: 12}}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <FormTextInput name="otp" label="کد تایید" type="number"/>
                                <Button variant="outlined" onClick={sendOtpCode}
                                        disabled={otpCooldown > 0 || !getValues("mobile")}>
                                    {otpCooldown > 0 ? `${otpCooldown} ثانیه باقی مانده` : "ارسال کد"}
                                </Button>
                            </Box>
                        </Grid>

                        <Grid size={{xs: 12}}>
                            <FormActions/>
                            <Box mt={1} textAlign="center">
                                <Button variant="text" color="inherit" LinkComponent={Link} href="/sign-in">
                                    {t("sign-up:actions.accountAlreadyExists")}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Container>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>{t("sign-up:dialog.title")}</DialogTitle>
                <DialogContent><Typography>{t("sign-up:dialog.welcomeMessage")}</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus variant="contained">
                        {t("sign-up:dialog.close")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!toastMessage}
                autoHideDuration={4000}
                onClose={() => setToastMessage(null)}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert onClose={() => setToastMessage(null)} severity="info" sx={{width: "100%"}}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </FormProvider>
    );
}

function SignUp() {
    return <Form/>;
}

export default withPageRequiredGuestSignUp(SignUp);
