import { useContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { UserContext } from "../../context/UserContext";
import userService from "../../services/userProfileService";
import {
    Typography, Container, CircularProgress, Alert, Avatar,
    Box, Button, TextField, IconButton, Card, CardContent, CardActions, Divider, List, ListItem, ListItemText
} from "@mui/material";
import { Edit, Save, Cancel, CloudUpload } from "@mui/icons-material";

const Profile = () => {
    const { token } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState("");
    const [editedAvatar, setEditedAvatar] = useState("");

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
            setLoading(false);
        }
    }, [token, fetchUserData]);

    const handleEditClick = () => setIsEditing(true);

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedUsername(user.username);
        setEditedAvatar(user.avatar);
    };

    const handleSaveClick = async () => {
        try {
            await userService.updateProfile(token, user._id, { username: editedUsername, avatar: editedAvatar });
            setUser(prev => ({ ...prev, username: editedUsername, avatar: editedAvatar }));
            setIsEditing(false);
        } catch (err) {
            setError("Failed to update profile.", err);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setEditedAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    if (loading) return (
        <Box align='center'>
            <CircularProgress />;
        </Box>
    );

    if (error) return (
        <Box align='center'>
            <Alert severity="error">{error}</Alert>
        </Box>
    );

    return (
        <Container>
            {user ? <ProfileDisplay
                user={user}
                isEditing={isEditing}
                editedUsername={editedUsername}
                editedAvatar={editedAvatar}
                onEditClick={handleEditClick}
                onAvatarChange={handleAvatarChange}
                onUsernameChange={setEditedUsername}
                onSaveClick={handleSaveClick}
                onCancelClick={handleCancelClick}
            /> :
                <Typography variant="h6">No user data available.</Typography>}
        </Container>
    );
};

const ProfileDisplay = ({
    user,
    isEditing,
    editedUsername,
    editedAvatar,
    onEditClick,
    onAvatarChange,
    onUsernameChange,
    onSaveClick,
    onCancelClick
}) => (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 2, boxShadow: 3 }}>
        <CardContent sx={{ textAlign: 'center' }}>
            <Box align='center'>
                <Avatar
                    alt={user.username}
                    src={isEditing ? editedAvatar : user.avatar}
                    sx={{ width: 120, height: 120, border: '2px solid #1976d2' }}
                />
                {isEditing && (
                    <IconButton component="label" color="primary" >
                        <CloudUpload />
                        <input type="file" hidden accept="image/*" onChange={onAvatarChange} />
                    </IconButton>
                )}
            </Box>

            {isEditing ? (
                <TextField
                    label="Username"
                    variant="outlined"
                    value={editedUsername}
                    onChange={(e) => onUsernameChange(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
            ) : (
                <Typography variant="h5" sx={{ mb: 1 }}>
                    {user.username}
                </Typography>
            )}

            <Divider sx={{ mb: 2 }} />

            <List>
                <ListItem>
                    <ListItemText primary="Email" secondary={user.email} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Role" secondary={user.roleID.roleName} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Faculty" secondary={user.facultyID.facultyName} />
                </ListItem>
            </List>
        </CardContent>

        <CardActions sx={{ justifyContent: 'center' }}>
            <ButtonGroup
                isEditing={isEditing}
                onEditClick={onEditClick}
                onSaveClick={onSaveClick}
                onCancelClick={onCancelClick}
            />
        </CardActions>
    </Card>
);

ProfileDisplay.propTypes = {
    user: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    editedUsername: PropTypes.string.isRequired,
    editedAvatar: PropTypes.string.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onAvatarChange: PropTypes.func.isRequired,
    onUsernameChange: PropTypes.func.isRequired,
    onSaveClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
}

const ButtonGroup = ({ isEditing, onEditClick, onSaveClick, onCancelClick }) => (
    isEditing ? (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" startIcon={<Save />} onClick={onSaveClick}>
                Save
            </Button>
            <Button variant="outlined" color="secondary" startIcon={<Cancel />} onClick={onCancelClick}>
                Cancel
            </Button>
        </Box>
    ) : (
        <Button variant="contained" color="primary" startIcon={<Edit />} onClick={onEditClick}>
            Edit Profile
        </Button>
    )
);

ButtonGroup.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onSaveClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
}

export default Profile;