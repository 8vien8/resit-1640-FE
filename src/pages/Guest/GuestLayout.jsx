import { Box } from "@mui/material"
import GuestNavbar from "../Navbar/GuestNavbar"
import { Outlet } from "react-router-dom"
function GuestLayout() {
    return (
        <Box sx={{ display: 'flex' }}>
            <GuestNavbar />
            <Box
                component="main"
                sx={{ flexGrow: 1, backgroundColor: 'background.default', p: 3 }}
            >

                <Outlet />
            </Box>
        </Box>
    )
}

export default GuestLayout