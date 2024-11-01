import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useFacultyService from '../../../services/facultiesService';
import {
    Container, Typography, TextField, Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { FacultyTable, ConfirmDeleteDialog } from './FacultiesTable';

const FacultiesManagement = () => {
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [facultyName, setFacultyName] = useState('');
    const [faculties, setFaculties] = useState([]);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [facultyToDelete, setFacultyToDelete] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const facultyService = useFacultyService();
    const navigate = useNavigate();

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
    }, [facultyService]);

    useEffect(() => {
        if (!hasFetchedData) {
            fetchData();
        }
    }, [fetchData, hasFetchedData]);

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
            fetchData();
        } catch (err) {
            console.error('Error details:', err.response?.data || err.message);
            setError('Error updating faculty. Please try again.');
        }
    };

    const handleDeleteFaculty = async () => {
        try {
            await facultyService.deleteFaculty(facultyToDelete._id);
            setSuccessMessage(`Faculty ${facultyToDelete.facultyName} deleted successfully!`);
            setConfirmDeleteDialogOpen(false);
            setFacultyToDelete(null);
            fetchData();
        } catch (err) {
            console.error('Error details:', err.response?.data || err.message);
            setError('Error deleting faculty. Please try again.');
        }
    };

    const openConfirmDeleteDialog = (faculty) => {
        setFacultyToDelete(faculty);
        setConfirmDeleteDialogOpen(true);
    };

    const handleViewFaculty = (faculty) => {
        const encodedFacultyName = encodeURIComponent(faculty.facultyName);
        navigate(`/umm/faculty/${faculty._id}/${encodedFacultyName}`);
    }

    const resetCreateForm = () => {
        setFacultyName('');
        setError(null);
    };
    return (
        <Container>
            <Typography variant="h4" gutterBottom>Faculties Management</Typography>

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

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error">{error}</Alert>
            </Snackbar>
            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
                <Alert onClose={() => setSuccessMessage('')} severity="success">{successMessage}</Alert>
            </Snackbar>

            <FacultyTable
                faculties={faculties}
                setEditingFaculty={setEditingFaculty}
                openConfirmDeleteDialog={openConfirmDeleteDialog}
                onViewFaculty={handleViewFaculty}
            />

            {editingFaculty && (
                <Dialog open={Boolean(editingFaculty)} onClose={() => setEditingFaculty(null)}>
                    <DialogTitle>Edit Faculty</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Faculty Name"
                            variant="outlined"
                            value={editingFaculty.facultyName}
                            onChange={(e) => setEditingFaculty({ ...editingFaculty, facultyName: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdateFaculty} color="primary" variant="contained">Update</Button>
                        <Button onClick={() => setEditingFaculty(null)} color="secondary" variant="outlined">Cancel</Button>
                    </DialogActions>
                </Dialog>
            )}

            <ConfirmDeleteDialog
                facultyToDelete={facultyToDelete}
                onDelete={handleDeleteFaculty}
                open={confirmDeleteDialogOpen}
                onClose={() => setConfirmDeleteDialogOpen(false)}
                onConfirm={handleDeleteFaculty}
                facultyName={facultyToDelete?.facultyName}
            />
        </Container>
    );
};

export default FacultiesManagement;
