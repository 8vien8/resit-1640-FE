import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import useUserService from '../../../services/userManagementService';
import useFacultyService from '../../../services/facultiesService';
import useRoleService from '../../../services/rolesService';
import PropTypes from 'prop-types';
import { AvatarUpload, SelectField } from './formUtils';

const UpdateUserForm = ({ user, onUserUpdated }) => {
    const userService = useUserService();
    const facultiesService = useFacultyService();
    const roleService = useRoleService();

    const [username, setUsername] = useState(user.username || '');
    const [email, setEmail] = useState(user.email || '');
    const [roleID, setRoleID] = useState(user.roleID?._id || '');
    const [facultyID, setFacultyID] = useState(user.facultyID?._id || '');
    const [avatar, setAvatar] = useState(user.avatar || null);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [fetchingData, setFetchingData] = useState(true);
    const [dataFetched, setDataFetched] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!dataFetched) {
                try {
                    const [rolesData, facultiesData] = await Promise.all([
                        roleService.getRoles(),
                        facultiesService.getFaculties()
                    ]);
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
    }, [dataFetched, roleService, facultiesService]);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setAvatar(user.avatar || null);
            setAvatarPreview(user.avatar || null);
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
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
            await userService.updateUser(user._id, formData);
            onUserUpdated();
        } catch (error) {
            console.error('Error updating user:', error);
            const errorResponse = error.response?.data;

            // Check if the error indicates that the email already exists
            if (errorResponse && errorResponse.message) {
                setErrorMessage(errorResponse.message); // Set the error message
                setShowError(true); // Show the error Snackbar
            } else {
                setErrorMessage('Failed to update user. Please try again later.'); // Generic error message
                setShowError(true);
            }
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
        <Box component="form" onSubmit={handleUpdate} sx={{ mt: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="h4">Update User Profile</Typography>
            </Box>
            <AvatarUpload
                disabled={loading}
                avatarPreview={avatarPreview}
                onAvatarChange={handleAvatarChange}
            />
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
            <SelectField
                disabled={loading}
                label="Role"
                value={roleID}
                onChange={(e) => setRoleID(e.target.value)}
                options={roles.filter(role => role.roleName !== 'Admin')}
                fetchingData={fetchingData}
            />
            <SelectField
                disabled={loading}
                label="Faculty"
                value={facultyID}
                onChange={(e) => setFacultyID(e.target.value)}
                options={faculties}
                fetchingData={fetchingData}
            />
            <Button fullWidth variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update User'}
            </Button>

            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert severity="error" onClose={() => setShowError(false)}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

UpdateUserForm.propTypes = {
    user: PropTypes.object.isRequired,
    onUserUpdated: PropTypes.func.isRequired,
};

export default UpdateUserForm;