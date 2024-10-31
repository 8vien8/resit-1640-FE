import { useState, useEffect, useCallback } from 'react';
import useFacultyService from '../../../services/facultiesService'; // Adjust the path according to your file structure
import {
    Container, Typography, TextField, Button, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';

const FacultiesManagement = () => {
    const [hasFetchData, setHasFetchedData] = useState(false)
    const [facultyName, setFacultyName] = useState('');
    const [faculties, setFaculties] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [facultyToDelete, setFacultyToDelete] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const facultyService = useFacultyService();

    const fetchData = useCallback(async () => {
        try {
            const facultyList = await facultyService.getFaculties();
            setFaculties(facultyList);
        } catch (err) {
            setError('Error fetching faculties. Please try again.');
            console.log(err);
        } finally {
            setHasFetchedData(true);
        }
    }, [facultyService])
    // Fetch faculties on component mount
    useEffect(() => {
        if (!hasFetchData) {
            fetchData();
        }
    }, [fetchData, hasFetchData]);

    const handleCreateFaculty = async () => {
        try {
            const response = await facultyService.createFaculty(facultyName);
            setSuccessMessage(`Faculty "${response.facultyName}" created successfully!`);
            resetCreateForm();
            fetchData();
        } catch (err) {
            console.error('Error details:', err.response?.data || err.message);
            setError('Error creating faculty. Please try again.');
        }
    };

    const handleUpdateFaculty = async () => {
        try {
            const updatedFaculty = await facultyService.updateFaculty(editingFaculty._id, { facultyName: editingFaculty.facultyName });
            setSuccessMessage(`Faculty "${updatedFaculty.facultyName}" updated successfully!`);
            setEditingFaculty(null);
            fetchData()
        } catch (err) {
            console.error('Error details:', err.response?.data || err.message);
            setError('Error updating faculty. Please try again.');
        }
    };

    const resetCreateForm = () => {
        setFacultyName('');
        setError(null);
    };

    const handleDeleteFaculty = async () => {
        try {
            await facultyService.deleteFaculty(facultyToDelete);
            setSuccessMessage('Faculty deleted successfully!');
            setConfirmDeleteDialogOpen(false);
            setFacultyToDelete(null);
            fetchData()
        } catch (err) {
            console.error('Error details:', err.response?.data || err.message);
            setError('Error deleting faculty. Please try again.');
        }
    };

    const openConfirmDeleteDialog = (facultyId) => {
        setFacultyToDelete(facultyId);
        setConfirmDeleteDialogOpen(true);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Faculties Management</Typography>

            {/* Add New Faculty */}
            <Typography variant="h6" style={{ marginTop: '1em' }}>Add New Faculty</Typography>
            <TextField
                label="Faculty Name"
                variant="outlined"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleCreateFaculty}>Create</Button>

            {/* Snackbar for Error and Success Messages */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
                <Alert onClose={() => setSuccessMessage('')} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* Table of Existing Faculties */}
            <TableContainer component={Paper} style={{ marginTop: '1em' }}>
                <Table>
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{ width: '80%', fontSize: '1.1rem' }} >Faculty Name</TableCell>
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
                                    <Button variant="outlined" color="error" onClick={() => openConfirmDeleteDialog(faculty._id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* View Faculty Dialog */}
            {selectedFaculty && (
                <Dialog open={Boolean(selectedFaculty)} onClose={() => setSelectedFaculty(null)}>
                    <DialogTitle>Faculty Details</DialogTitle>
                    <DialogContent>
                        <Typography>Name: {selectedFaculty.facultyName}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedFaculty(null)} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            )}
            {/* Edit Faculty Dialog */}
            {editingFaculty && (
                <Dialog
                    open={Boolean(editingFaculty)}
                    onClose={() => setEditingFaculty(null)}
                    PaperProps={{
                        style: {
                            width: '450px', // Fixed width for a balanced look
                            maxWidth: '90%', // Responsive max width
                            borderRadius: '12px', // Slightly rounded corners
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
                        },
                    }}
                >
                    <DialogTitle style={{ fontWeight: '600', fontSize: '1.5rem' }}>Edit Faculty</DialogTitle>
                    <DialogContent style={{ padding: '5px 20px' }}>
                        <TextField
                            label="Faculty Name"
                            variant="outlined"
                            value={editingFaculty.facultyName}
                            onChange={(e) => setEditingFaculty({ ...editingFaculty, facultyName: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions style={{ padding: '16px' }}>
                        <Button
                            onClick={handleUpdateFaculty}
                            color="primary"
                            variant="contained"
                            style={{ marginRight: '8px' }} // Space between buttons
                        >
                            Update
                        </Button>
                        <Button onClick={() => setEditingFaculty(null)} color="secondary" variant="outlined">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}


            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete <strong>{selectedFaculty}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteFaculty} color="error">Yes, Delete</Button>
                    <Button onClick={() => setConfirmDeleteDialogOpen(false)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default FacultiesManagement;
