import { useState, useEffect } from 'react';
import {
    Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, IconButton,
    Divider, Tooltip,
} from '@mui/material';
import {
    Dashboard, Menu, ChevronLeft, AccountCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LogoutButton from '../public/Logout';

const drawerWidth = 200;
const drawerWidthCollapsed = 80;

const navItems = [
    { label: 'Dashboard', icon: <Dashboard fontSize='large' />, path: '/guest' },
    { label: 'Profile', icon: <AccountCircle fontSize='large' />, path: '/guest/profile' },
];

function GuestNavbar() {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (!isMobile) {
            setIsCollapsed(true);
            setMobileOpen(false);
        }
    }, [isMobile]);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleMenuClick = () => {
        setIsCollapsed(true);
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) setMobileOpen(false);
    };

    const drawer = (
        <Box sx={{ overflow: 'auto', height: '100%', mt: 4 }}>
            <List>
                {navItems.map(({ label, icon, path }) => (
                    <Tooltip key={label} title={label} placement="right" disableHoverListener={!isCollapsed}>
                        <ListItemButton onClick={() => handleNavigation(path)}>
                            <ListItemIcon sx={{ justifyContent: "center" }}>{icon}</ListItemIcon>
                            {!isCollapsed && <ListItemText primary={label} />} {/* Show text only if expanded */}
                        </ListItemButton>
                    </Tooltip>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {isMobile && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleMenuClick}
                    sx={{ position: 'absolute', top: 16, left: 16 }}
                >
                    <Menu />
                </IconButton>
            )}

            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={!isMobile || mobileOpen}
                onClose={isMobile ? handleDrawerToggle : null}
                sx={{
                    width: isCollapsed ? drawerWidthCollapsed : drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: isCollapsed ? drawerWidthCollapsed : drawerWidth,
                        boxSizing: 'border-box',
                        transition: 'width 0.3s ease-in-out',
                        overflow: 'hidden',
                    },
                }}
            >
                <Toolbar sx={{ justifyContent: 'center' }}>
                    <IconButton
                        color='primary'
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        sx={{ border: '1px solid #1976d2' }}
                    >
                        {isCollapsed ? <Menu /> : <ChevronLeft />}
                    </IconButton>
                </Toolbar>
                <Divider />
                {drawer}
                <LogoutButton isMobile={isMobile} isCollapsed={isCollapsed} />
            </Drawer>
        </Box>
    );
}

export default GuestNavbar;
