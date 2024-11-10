import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useFacultyService from '../../../services/facultiesService';
import {
    Container, Box, Typography, TextField, Button, Snackbar, Alert, Dialog, DialogActions,
    DialogContent, DialogTitle,
    CircularProgress
} from '@mui/material';
import { FacultyTable, ConfirmDeleteDialog } from './FacultiesTable';

const styles = {
    primaryOrange: "#DD730C",
    primaryGreen: "#4CAF50",
    primaryBlue: "#2196F3",
    lightGray: "#B0BEC5",
    offWhite: "#F5F5F5",
};

const FacultiesManagement = () => {
    const navigate = useNavigate();
    const facultyService = useFacultyService();
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [facultyName, setFacultyName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [faculties, setFaculties] = useState([]);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [facultyToDelete, setFacultyToDelete] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            const facultyList = await facultyService.getFaculties();
            setFaculties(facultyList);
        } catch (err) {
            setError('Error fetching faculties. Please try again.');
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, [facultyService]);

    useEffect(() => {
        if (!hasFetchedData) {
            fetchData();
            setHasFetchedData(true);
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
    };

    const resetCreateForm = () => {
        setFacultyName('');
        setError(null);
    };

    const filteredFaculties = faculties.filter(faculty =>
        faculty.facultyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container sx={{ padding: '20px', backgroundColor: styles.offWhite, borderRadius: '8px', boxShadow: 3 }}>
            <Typography align='center' variant="h4" gutterBottom sx={{ color: styles.primaryBlue }}>
                Faculties Management
            </Typography>

            <Typography variant="h6" sx={{ marginTop: '1em', color: styles.primaryOrange }}>Create New Faculty</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                    label="Input new Faculty name"
                    variant="outlined"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    margin="normal"

                />
                <Button size='large' variant="contained" onClick={handleCreateFaculty} sx={{ backgroundColor: styles.primaryGreen }}>
                    Create
                </Button>
            </Box>

            <TextField
                label="Search Faculty"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                margin="normal"
            />

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error">{error}</Alert>
            </Snackbar>
            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
                <Alert onClose={() => setSuccessMessage('')} severity="success">{successMessage}</Alert>
            </Snackbar>

            {isLoading ? (
                <CircularProgress />
            ) : (
                <FacultyTable
                    faculties={filteredFaculties}
                    setEditingFaculty={setEditingFaculty}
                    openConfirmDeleteDialog={openConfirmDeleteDialog}
                    onViewFaculty={handleViewFaculty}
                />
            )}

            {editingFaculty && (
                <Dialog open={Boolean(editingFaculty)} onClose={() => setEditingFaculty(null)}>
                    <DialogTitle align='center'>Edit Faculty</DialogTitle>
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
                facultyName={facultyToDelete?.facultyName}
            />
        </Container>
    );
};

export default FacultiesManagement;