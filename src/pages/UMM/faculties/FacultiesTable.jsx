// FacultyTable.js
import PropTypes from 'prop-types';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, Typography
} from '@mui/material';

const FacultyTable = ({ faculties, setSelectedFaculty, setEditingFaculty, openConfirmDeleteDialog }) => (
    <TableContainer component={Paper} style={{ marginTop: '1em' }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell sx={{ width: '80%', fontSize: '1.1rem' }}>Faculty Name</TableCell>
                    <TableCell sx={{ width: '20%', fontSize: '1.1rem', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {faculties.map((faculty) => (
                    <TableRow key={faculty._id}>
                        <TableCell>{faculty.facultyName}</TableCell>
                        <TableCell sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="contained" color="primary" onClick={() => setSelectedFaculty(faculty)}>View</Button>
                            <Button variant="contained" color="secondary" onClick={() => setEditingFaculty(faculty)}>Edit</Button>
                            <Button variant="outlined" color="error" onClick={() => openConfirmDeleteDialog(faculty)}>Delete</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

FacultyTable.propTypes = {
    faculties: PropTypes.arrayOf(PropTypes.object).isRequired,
    setSelectedFaculty: PropTypes.func.isRequired,
    setEditingFaculty: PropTypes.func.isRequired,
    openConfirmDeleteDialog: PropTypes.func.isRequired,
}

const ConfirmDeleteDialog = ({ open, onClose, onDelete, facultyToDelete }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
            <Typography>
                Are you sure you want to delete <strong>{facultyToDelete?.facultyName}</strong>?
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onDelete} color="error">Yes, Delete</Button>
            <Button onClick={onClose} color="primary">Cancel</Button>
        </DialogActions>
    </Dialog>
);

ConfirmDeleteDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    facultyToDelete: PropTypes.object,
}

export {
    FacultyTable,
    ConfirmDeleteDialog,
};
