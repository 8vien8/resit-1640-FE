import { useEffect, useState, useCallback } from 'react';
import useUserService from '../../services/userManagementService';
import useFacultyService from '../../services/facultiesService';
import useRoleService from '../../services/rolesService';
import CreateUserForm from './user/createUserForm';
import UpdateUserForm from './user/updateUserForm';
import {
    Button, Modal, Box, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, DialogContentText, Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import UserTable from './user/userTable';
import FilterBar from './user/filterBar';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [roles, setRoles] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const userService = useUserService();
    const facultyService = useFacultyService();
    const roleService = useRoleService();
    const [hasFetchedData, setHasFetchedData] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [usersData, rolesData, facultiesData] = await Promise.all([
                userService.getUsers(),
                roleService.getRoles(),
                facultyService.getFaculties()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
            setFaculties(facultiesData);
        } catch (error) {
            setSnackbarMessage('Error fetching data, please try again later.');
            setSnackbarOpen(true);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            setHasFetchedData(true);
        }
    }, [userService, facultyService, roleService]);

    useEffect(() => {
        if (!hasFetchedData) {
            fetchData();
        }
    }, [fetchData, hasFetchedData]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleRoleFilterChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleFacultyFilterChange = (e) => {
        setSelectedFaculty(e.target.value);
    };

    const handleUserCreated = () => {
        setIsCreateUserModalOpen(false);
        fetchData();
        setSnackbarMessage('User created successfully!');
        setSnackbarOpen(true);
    };

    const handleDeleteUser = async () => {
        if (userToDelete) {
            try {
                await userService.deleteUser(userToDelete._id);
                fetchData();
                setSnackbarMessage('User deleted successfully!');
                setSnackbarOpen(true);
            } catch (error) {
                setSnackbarMessage('Error deleting user, please try again.');
                setSnackbarOpen(true);
                console.error('Error deleting user:', error);
            } finally {
                setConfirmDeleteOpen(false);
                setUserToDelete(null);
            }
        }
    };

    const openDeleteConfirmation = (user) => {
        setUserToDelete(user);
        setConfirmDeleteOpen(true);
    };

    const openUpdateUserModal = (user) => {
        setUserToUpdate(user);
        setIsUpdateUserModalOpen(true);
    };

    const handleUserUpdated = () => {
        setIsUpdateUserModalOpen(false);
        fetchData();
        setSnackbarMessage('User updated successfully!');
        setSnackbarOpen(true);
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm);
        const matchesRole = selectedRole ? user.roleID?.roleName === selectedRole : true;
        const matchesFaculty = selectedFaculty ? user.facultyID?.facultyName === selectedFaculty : true;
        return matchesSearch && matchesRole && matchesFaculty;
    });

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ padding: 2, overflowX: 'auto' }}>
            {/* Search and filter */}
            <FilterBar searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                selectedRole={selectedRole}
                handleRoleFilterChange={handleRoleFilterChange}
                roles={roles}
                selectedFaculty={selectedFaculty}
                handleFacultyFilterChange={handleFacultyFilterChange}
                faculties={faculties} />

            <Button sx={{ mb: 2 }} variant="contained" color="primary" onClick={() => setIsCreateUserModalOpen(true)}>
                Create New User
            </Button>
            {/* Create User Modal */}
            <Modal
                open={isCreateUserModalOpen}
                onClose={() => setIsCreateUserModalOpen(false)}
                sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        p: 4, bgcolor: 'background.paper', width: '400px', maxHeight: '90%', overflowY: 'auto', borderRadius: 2,
                    }}>
                    <CreateUserForm onCreatedUser={handleUserCreated} onClose={() => setIsCreateUserModalOpen(false)} />
                </Box>
            </Modal>

            {/* Update User Modal */}
            <Modal
                open={isUpdateUserModalOpen}
                onClose={() => setIsUpdateUserModalOpen(false)}
                sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        p: 4, bgcolor: 'background.paper', width: '400px', maxHeight: '90%', overflowY: 'auto', borderRadius: 2,
                    }}
                >
                    {userToUpdate && (
                        <UpdateUserForm
                            user={userToUpdate}
                            onUserUpdated={handleUserUpdated}
                            onClose={() => setIsUpdateUserModalOpen(false)}
                        />
                    )}
                </Box>
            </Modal>

            {/* Loading indicator */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                // User table
                <UserTable
                    filteredUsers={filteredUsers}
                    openUpdateUserModal={openUpdateUserModal}
                    openDeleteConfirmation={openDeleteConfirmation} />
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the user: {userToDelete?.username}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={handleDeleteUser}>Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default UserManagement;
