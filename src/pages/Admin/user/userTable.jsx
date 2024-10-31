import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
const UserTable = ({ filteredUsers, openUpdateUserModal, openDeleteConfirmation }) => {
    return (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontSize: '1.1rem', width: '8%' }}>Avatar</TableCell>
                        <TableCell sx={{ fontSize: '1.1rem', width: '19%' }}>Username</TableCell>
                        <TableCell sx={{ fontSize: '1.1rem', width: '15%' }}>Email</TableCell>
                        <TableCell sx={{ fontSize: '1.1rem', width: '15%' }}>Role</TableCell>
                        <TableCell sx={{ fontSize: '1.1rem', width: '15%' }}>Faculty</TableCell>
                        <TableCell sx={{ fontSize: '1.1rem', width: '14%' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>
                                <img src={user.avatar} alt="User Avatar" width={40} height={40} />
                            </TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.roleID?.roleName}</TableCell>
                            <TableCell>{user.facultyID?.facultyName}</TableCell>
                            <TableCell>
                                {user.roleID?.roleName !== 'Admin' && (
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        <Button
                                            variant="outlined" color="primary" onClick={() => openUpdateUserModal(user)}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="outlined" color="error" onClick={() => openDeleteConfirmation(user)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

UserTable.propTypes = {
    filteredUsers: PropTypes.array.isRequired,
    openUpdateUserModal: PropTypes.func.isRequired,
    openDeleteConfirmation: PropTypes.func.isRequired,
}

export default UserTable;
