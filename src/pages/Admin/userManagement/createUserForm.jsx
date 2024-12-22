import { useState, useEffect } from 'react';
import {
    TextField, Button, Box, Typography, Snackbar, Alert
} from '@mui/material';
import useUserService from '../../../services/userManagementService';
import useFacultyService from '../../../services/facultiesService';
import useRoleService from '../../../services/rolesService';
import PropTypes from 'prop-types';
import { AvatarUpload, SelectField } from './formUtils';

const CreateUserForm = ({ onCreatedUser, onError }) => {
    const userService = useUserService();
    const facultiesService = useFacultyService();
    const roleService = useRoleService();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        roleID: '',
        facultyID: '',
        avatar: null,
    });
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [fetchingData, setFetchingData] = useState(true);
    const [showError, setShowError] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

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

    const isValidEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|fpt\.edu\.vn)$/;
        return emailPattern.test(email);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some(value => !value) || !isValidEmail(formData.email)) {
            const message = Object.values(formData).some(value => !value)
                ? "Please fill out all required fields."
                : "Email must be a valid Gmail address.";

            onError(message);
            return;
        }
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        try {
            await userService.createUser(data);
            onCreatedUser();
        } catch (error) {
            const errorMessage = error.response && error.response.data.message
                ? error.response.data.message
                : 'An error occurred while creating the user.';
            onError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    return (
        <Box component="form" onSubmit={handleCreate} sx={{ mt: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>Create New User</Typography>

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
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                disabled={loading}
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
            />

            <SelectField
                disabled={loading}
                label="Role"
                value={formData.roleID}
                onChange={(e) => setFormData(prev => ({ ...prev, roleID: e.target.value }))}
                options={roles.filter(role => role.roleName !== 'Admin')}
                fetchingData={fetchingData}
            />
            <SelectField
                disabled={loading}
                label="Faculty"
                value={formData.facultyID}
                onChange={(e) => setFormData(prev => ({ ...prev, facultyID: e.target.value }))}
                options={faculties}
                fetchingData={fetchingData}
            />

            <Button fullWidth variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
            </Button>

            <Snackbar
                open={showError}
                autoHideDuration={3000}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert severity="error" onClose={() => setShowError(false)}>
                    {Object.values(formData).some(value => !value) ? "Please fill out all required fields." : "Email must be a valid Gmail address."}
                </Alert>
            </Snackbar>
        </Box>
    );
};

CreateUserForm.propTypes = {
    onCreatedUser: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
};

export default CreateUserForm;