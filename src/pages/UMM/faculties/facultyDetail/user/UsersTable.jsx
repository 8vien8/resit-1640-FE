import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import PropTypes from 'prop-types';

const styles = {
    primaryBlue: "#2196F3",
    primaryGreen: "#4CAF50",
    primaryOrange: "#DD730C",
    lightGray: "#CCCCCC",
    offWhite: "#F5F5F5",
};

const UsersTable = ({ users }) => {
    return (
        <TableContainer component={Paper} style={{ marginTop: '1em', backgroundColor: styles.offWhite }}>
            <Table>
                <TableHead sx={{ backgroundColor: styles.primaryOrange }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>Avatar</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <TableRow key={user._id} sx={{ '&:hover': { backgroundColor: styles.lightGray } }}>
                                <TableCell>
                                    <Avatar alt={user.username} src={user.avatar} />
                                </TableCell>
                                <TableCell sx={{ color: styles.primaryBlue }}>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: styles.primaryGreen }}>{user.roleID?.roleName}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ fontStyle: 'italic', color: styles.lightGray }}>
                                No user joined in this faculty!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

UsersTable.propTypes = {
    users: PropTypes.array.isRequired,
};

export default UsersTable;