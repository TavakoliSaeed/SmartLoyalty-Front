"use client";

import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import useAuth from "@/services/auth/use-auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import { useTranslation } from "@/services/i18n/client";
import Link from "@/components/link";
import ThemeSwitchButton from "@/components/switch-theme-button";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";

function ResponsiveAppBar() {
    const { t } = useTranslation("common");
    const { user, isLoaded } = useAuth();
    const { logOut } = useAuthActions();
    const [anchorElementUser, setAnchorElementUser] = useState<null | HTMLElement>(null);
    const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);
    const isMobileMenuOpen = Boolean(mobileAnchorEl);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElementUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElementUser(null);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        {t("common:app-name")}
                    </Typography>

                    {/* Mobile Menu Icon */}
                    {isLoaded && user && (
                        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                            <IconButton
                                size="large"
                                aria-label="menu"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={mobileAnchorEl}
                                open={isMobileMenuOpen}
                                onClose={handleMobileMenuClose}
                                keepMounted
                                transformOrigin={{ vertical: "top", horizontal: "right" }}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            >
                                <MenuItem component={Link} href="/registration">
                                    {t("common:navigation.registrationsList")}
                                </MenuItem>
                                <MenuItem component={Link} href="/registration/add">
                                    {t("common:navigation.newRegistration")}
                                </MenuItem>
                                <Divider />
                                <MenuItem component={Link} href="/gift">
                                    {t("common:navigation.giftsList")}
                                </MenuItem>
                                <MenuItem component={Link} href="/gift/my">
                                    {t("common:navigation.myGifts")}
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}

                    {isLoaded && !user && (
                        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                            <IconButton
                                size="large"
                                aria-label="menu"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={mobileAnchorEl}
                                open={isMobileMenuOpen}
                                onClose={handleMobileMenuClose}
                                keepMounted
                                transformOrigin={{ vertical: "top", horizontal: "right" }}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            >
                                <MenuItem component={Link} href="/sign-in">
                                    {t("common:navigation.signIn")}
                                </MenuItem>
                                <MenuItem component={Link} href="/sign-up">
                                    {t("common:navigation.signUp")}
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}

                    {/* Desktop Menu */}
                    {isLoaded && user && (
                        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, mr: 2 }} flexGrow={900}>
                            <Button color="inherit" component={Link} href="/registration">
                                {t("common:navigation.registrations")}
                            </Button>
                            <Button color="inherit" component={Link} href="/registration/add">
                                {t("common:navigation.newRegistration")}
                            </Button>
                            <Button color="inherit" component={Link} href="/gift">
                                {t("common:navigation.gifts")}
                            </Button>
                            <Button color="inherit" component={Link} href="/gift/my">
                                {t("common:navigation.myGifts")}
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ display: "flex", mr: 1 }}>
                        <ThemeSwitchButton />
                    </Box>

                    {!isLoaded ? (
                        <CircularProgress color="inherit" />
                    ) : user ? (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Profile menu">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={user?.owner_name || user?.email} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: 5.5 }}
                                anchorEl={anchorElementUser}
                                open={Boolean(anchorElementUser)}
                                onClose={handleCloseUserMenu}
                                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                transformOrigin={{ vertical: "top", horizontal: "right" }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        logOut();
                                        handleCloseUserMenu();
                                    }}
                                >
                                    {t("common:navigation.logout")}
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box sx={{ display: { xs: "none", md: "flex" }, ml: "auto" }}>
                            <Button sx={{ color: "white" }} component={Link} href="/sign-in">
                                {t("common:navigation.signIn")}
                            </Button>
                            {IS_SIGN_UP_ENABLED && (
                                <Button sx={{ color: "white" }} component={Link} href="/sign-up">
                                    {t("common:navigation.signUp")}
                                </Button>
                            )}
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;