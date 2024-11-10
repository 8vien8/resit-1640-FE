import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
const styles = {
    primaryBlue: "#2196F3",
    primaryGreen: "#4CAF50",
    primaryOrange: "#DD730C",
    lightGray: "#CCCCCC",
    offWhite: "#F5F5F5",
};
const UserTable = ({ filteredUsers, openUpdateUserModal, openDeleteConfirmation }) => {
    return (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }} >
            <Table>
                <TableHead sx={{ backgroundColor: styles.primaryOrange }}>
                    <TableRow>
                        <TableCell sx={{ fontSize: '1.1rem', width: '8%', color: 'white' }}>Avatar</TableCell>
                        <TableCell sx={{ fontSize: '1.1rem', width: '19%', color: 'white' }}>Username</TableCell>
                        <TableCell sx={{ fontSize: '1.1rem', width: '15%', color: 'white' }}>Email</TableCell>
                        <TableCell sx={{ fontSize: '1.1rem', width: '15%', color: 'white' }}>Role</TableCell>
                        <TableCell sx={{ fontSize: '1.1rem', width: '15%', color: 'white' }}>Faculty</TableCell>
                        <TableCell sx={{ fontSize: '1.1rem', width: '14%', color: 'white' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredUsers.map((user) => (
                        <TableRow key={user._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: styles.lightGray } }}>
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
                                            variant="contained" color="primary" onClick={() => openUpdateUserModal(user)}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="contained" color="error" onClick={() => openDeleteConfirmation(user)}
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
