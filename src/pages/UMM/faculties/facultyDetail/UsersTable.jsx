import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import PropTypes from 'prop-types';
const UsersTable = ({ users }) => {
    return (
        <TableContainer component={Paper} style={{ marginTop: '1em' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Avatar</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <Avatar alt={user.username} src={user.avatar} />
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.roleID?.roleName}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">No user joined in this faculty!</TableCell>
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