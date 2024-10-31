import { useState, useEffect } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography } from '@mui/material';
import useUserService from '../../../services/userManagementService';
import useFacultyService from '../../../services/facultiesService';
import useRoleService from '../../../services/rolesService';
import PropTypes from 'prop-types';
import { CloudUpload } from '@mui/icons-material';

const AvatarUpload = ({ avatarPreview, onAvatarChange }) => (
    <FormControl fullWidth required sx={{ mb: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        {avatarPreview && (
            <img
                src={avatarPreview}
                alt="Avatar Preview"
                style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }}
            />
        )}
        <Button
            variant="contained"
            color="primary"
            component="label"
            sx={{ textTransform: 'none', padding: '6px 10px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            startIcon={<CloudUpload />}
        >
            Choose an Avatar
            <input
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                style={{ display: 'none' }}
            />
        </Button>
    </FormControl>
);

const SelectField = ({ label, value, onChange, options, fetchingData }) => (
    <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel>{label}</InputLabel>
        <Select value={value} onChange={onChange}>
            {fetchingData ? (
                <MenuItem disabled>
                    <CircularProgress size={24} />
                </MenuItem>
            ) : (
                options.map(option => (
                    <MenuItem key={option._id} value={option._id} sx={{ "&:hover": { fontWeight: "bold" } }}>
                        {option.roleName || option.facultyName}
                    </MenuItem>
                ))
            )}
        </Select>
    </FormControl>
);

const UpdateUserForm = ({ user, onUserUpdated, onClose }) => {
    const userService = useUserService();
    const facultiesService = useFacultyService();
    const roleService = useRoleService();

    const [username, setUsername] = useState(user.username || '');
    const [email, setEmail] = useState(user.email || '');
    const [roleID, setRoleID] = useState('');
    const [facultyID, setFacultyID] = useState('');
    const [avatar, setAvatar] = useState(user.avatar || null);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [fetchingData, setFetchingData] = useState(true);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!dataFetched) {
                try {
                    const [rolesData, facultiesData] = await Promise.all([roleService.getRoles(), facultiesService.getFaculties()]);
                    setRoles(rolesData);
                    setFaculties(facultiesData);

                    setRoleID(rolesData.find(role => role._id === user.roleID?._id)?._id || '');
                    setFacultyID(facultiesData.find(faculty => faculty._id === user.facultyID?._id)?._id || '');
                    setDataFetched(true);
                } catch (error) {
                    console.error('Error fetching roles or faculties:', error);
                } finally {
                    setFetchingData(false);
                }
            }
        };
        fetchData();
    }, [dataFetched, user.roleID, user.facultyID, roleService, facultiesService]);

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
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
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
            <AvatarUpload avatarPreview={avatarPreview} onAvatarChange={handleAvatarChange} />
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
            />
            <SelectField
                label="Role"
                value={roleID}
                onChange={(e) => setRoleID(e.target.value)}
                options={roles.filter(role => role.roleName !== 'Admin')}
                fetchingData={fetchingData}
            />
            <SelectField
                label="Faculty"
                value={facultyID}
                onChange={(e) => setFacultyID(e.target.value)}
                options={faculties}
                fetchingData={fetchingData}
            />
            <Button fullWidth variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update User'}
            </Button>
        </Box>
    );
};

UpdateUserForm.propTypes = {
    user: PropTypes.object.isRequired,
    onUserUpdated: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

AvatarUpload.propTypes = {
    avatarPreview: PropTypes.string,
    onAvatarChange: PropTypes.func.isRequired,
};

SelectField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    fetchingData: PropTypes.bool.isRequired,
}

export default UpdateUserForm;
