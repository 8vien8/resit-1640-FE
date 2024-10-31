import { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "../../context/UserContext";
import userService from "../../services/userProfileService";
import { Typography, Container, CircularProgress, Alert, Avatar, Box, Button, TextField, IconButton } from "@mui/material";
import { Edit, Save, Cancel, CloudUpload } from "@mui/icons-material";

const Profile = () => {
    const { token } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState("");
    const [editedAvatar, setEditedAvatar] = useState("");

    // Tạo callback để fetch dữ liệu
    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            const userData = await userService.getMe(token);
            setUser(userData);
            setEditedUsername(userData.username);
            setEditedAvatar(userData.avatar);
        } catch (err) {
            setError("Failed to fetch user data.", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchUserData();
        } else {
            setLoading(false); // No token available, stop loading
        }
    }, [token, fetchUserData]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedUsername(user.username); // Revert changes
        setEditedAvatar(user.avatar);
    };

    const handleSaveClick = async () => {
        try {
            // Save the updated data
            await userService.updateProfile(token, user._id, { username: editedUsername, avatar: editedAvatar });
            setUser((prev) => ({ ...prev, username: editedUsername, avatar: editedAvatar }));
            setIsEditing(false);
        } catch (err) {
            setError("Failed to update profile.", err);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditedAvatar(reader.result); // Set avatar as base64 URL
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Container>
            {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            alt={user.username}
                            src={isEditing ? editedAvatar : user.avatar} // Use edited avatar in edit mode
                            sx={{ width: 120, height: 120 }} // Adjust size as needed
                        />
                        {isEditing && (
                            <IconButton component="label" color="primary">
                                <CloudUpload />
                                <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                            </IconButton>
                        )}
                    </Box>

                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                        {isEditing ? (
                            <TextField
                                label="Username"
                                variant="outlined"
                                value={editedUsername}
                                onChange={(e) => setEditedUsername(e.target.value)}
                                fullWidth
                            />
                        ) : (
                            <Typography variant="h6">Username: {user.username}</Typography>
                        )}

                        <Typography variant="h6">Email: {user.email}</Typography>
                        <Typography variant="h6">Role: {user.roleID.roleName}</Typography>
                        <Typography variant="h6">Faculty: {user.facultyID.facultyName}</Typography>
                    </Box>

                    {isEditing ? (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSaveClick}>
                                Save
                            </Button>
                            <Button variant="outlined" color="secondary" startIcon={<Cancel />} onClick={handleCancelClick}>
                                Cancel
                            </Button>
                        </Box>
                    ) : (
                        <Button variant="contained" color="primary" startIcon={<Edit />} onClick={handleEditClick}>
                            Edit Profile
                        </Button>
                    )}
                </Box>
            ) : (
                <Typography variant="h6">No user data available.</Typography>
            )}
        </Container>
    );
};

export default Profile;
