import { useState, useEffect } from 'react';
import {
    TextField, Button, Box, FormControl, InputLabel, Select, MenuItem,
    CircularProgress, Typography, Snackbar, Alert
} from '@mui/material';
import useUserService from '../../../services/userManagementService';
import useFacultyService from '../../../services/facultiesService';
import useRoleService from '../../../services/rolesService';
import PropTypes from 'prop-types';
import { CloudUpload } from '@mui/icons-material';

const CreateUserForm = ({ onCreatedUser }) => {
    const userService = useUserService();
    const facultiesService = useFacultyService();
    const roleService = useRoleService();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [roleID, setRoleID] = useState('');
    const [facultyID, setFacultyID] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [fetchingData, setFetchingData] = useState(true);
    const [dataFetched, setDataFetched] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!dataFetched) {
                try {
                    const rolesData = await roleService.getRoles();
                    const facultiesData = await facultiesService.getFaculties();
                    setRoles(rolesData);
                    setFaculties(facultiesData);
                    setDataFetched(true);
                } catch (error) {
                    console.error('Error fetching roles or faculties:', error);
                } finally {
                    setFetchingData(false);
                }
            }
        };
        fetchData();
    }, [roleService, facultiesService, dataFetched]);

    const handleCreate = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!username || !email || !roleID || !facultyID || !avatar) {
            setShowError(true); // Show Snackbar if fields are missing
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('roleID', roleID);
        formData.append('facultyID', facultyID);

        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            await userService.createUser(formData);
            onCreatedUser(); // Callback to refresh user list
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    return (
        <Box component="form" onSubmit={handleCreate} sx={{ mt: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Create New User
            </Typography>

            <FormControl disabled={loading} fullWidth sx={{ mb: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {avatarPreview && (
                    <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: 10,
                        }}
                    />
                )}
                <Button
                    disabled={loading}
                    variant="contained"
                    color="primary"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{
                        textTransform: 'none',
                        padding: '6px 10px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    Choose an Avatar
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                    />
                </Button>
            </FormControl>

            <TextField
                disabled={loading}
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                disabled={loading}
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
            />
            <FormControl disabled={loading} fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                    value={roleID}
                    onChange={(e) => setRoleID(e.target.value)}
                >
                    {fetchingData ? (
                        <MenuItem disabled>
                            <CircularProgress size={24} />
                        </MenuItem>
                    ) : (
                        roles
                            .filter((role) => role.roleName !== 'Admin')
                            .map((role) => (
                                <MenuItem key={role._id} value={role._id} sx={{
                                    "&:hover": {
                                        fontWeight: "bold",
                                    },
                                }}>
                                    {role.roleName}
                                </MenuItem>
                            ))
                    )}
                </Select>
            </FormControl>

            <FormControl disabled={loading} fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Faculty</InputLabel>
                <Select
                    value={facultyID}
                    onChange={(e) => setFacultyID(e.target.value)}
                >
                    {fetchingData ? (
                        <MenuItem disabled>
                            <CircularProgress size={24} />
                        </MenuItem>
                    ) : (
                        faculties.map((faculty) => (
                            <MenuItem key={faculty._id} value={faculty._id} sx={{
                                "&:hover": {
                                    fontWeight: "bold",
                                },
                            }}>
                                {faculty.facultyName}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>

            <Button fullWidth variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
            </Button>

            {/* Snackbar for error display */}
            <Snackbar
                open={showError}
                autoHideDuration={3000}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}  // Adjusted to bottom-left
            >
                <Alert severity="error" onClose={() => setShowError(false)}>
                    Please fill out all required fields.
                </Alert>
            </Snackbar>
        </Box>
    );
};

CreateUserForm.propTypes = {
    onCreatedUser: PropTypes.func.isRequired,
};

export default CreateUserForm;
