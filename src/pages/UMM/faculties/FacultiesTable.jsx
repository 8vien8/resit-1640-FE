import PropTypes from 'prop-types';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, Typography
} from '@mui/material';

const styles = {
    primaryOrange: "#DD730C",
    primaryGreen: "#4CAF50",
    primaryBlue: "#2196F3",
    lightGray: "#B0BEC5",
    offWhite: "#F5F5F5",
};

const FacultyTable = ({ faculties, onViewFaculty, setEditingFaculty, openConfirmDeleteDialog }) => {

    return (
        <TableContainer component={Paper} style={{ marginTop: '1em', backgroundColor: styles.offWhite }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: styles.primaryOrange }}>
                        <TableCell sx={{ width: '80%', fontSize: '1.1rem', color: 'white' }}>Faculty Name</TableCell>
                        <TableCell sx={{ width: '20%', fontSize: '1.1rem', textAlign: 'center', color: 'white' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {faculties.map((faculty) => (
                        <TableRow key={faculty._id}>
                            <TableCell sx={{ color: styles.primaryBlue }}>
                                {faculty.facultyName}
                            </TableCell>
                            <TableCell sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="contained" sx={{ backgroundColor: styles.primaryGreen }} onClick={() => onViewFaculty(faculty)}>View</Button>
                                <Button variant="contained" color="secondary" onClick={() => setEditingFaculty(faculty)}>Edit</Button>
                                <Button variant="contained" color="error" onClick={() => openConfirmDeleteDialog(faculty)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

FacultyTable.propTypes = {
    faculties: PropTypes.arrayOf(PropTypes.object).isRequired,
    onViewFaculty: PropTypes.func.isRequired,
    setEditingFaculty: PropTypes.func.isRequired,
    openConfirmDeleteDialog: PropTypes.func.isRequired,
};

const ConfirmDeleteDialog = ({ open, onClose, onDelete, facultyToDelete }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle align='center'>Confirm Delete</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete <strong>{facultyToDelete?.facultyName}</strong>?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDelete} color="error" variant="outlined">Yes, Delete</Button>
                <Button onClick={onClose} color="primary" variant="outlined">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmDeleteDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    facultyToDelete: PropTypes.object,
};

export {
    FacultyTable,
    ConfirmDeleteDialog,
};