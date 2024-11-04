import { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, Snackbar, Alert, Box, FormControl, Select, MenuItem, InputLabel
} from '@mui/material';
import PropTypes from 'prop-types';
import useTopicService from '../../../../services/topicService';
import { useNavigate } from 'react-router-dom';

const TopicsTable = ({ topics, facultyId, onChangeData }) => {
    const topicService = useTopicService();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [newTopic, setNewTopic] = useState({
        topicName: '',
        releaseDate: '',
        endDate: '',
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');

    const handleClickOpen = (topic) => {
        setOpen(true);
        if (topic) {
            setCurrentTopic(topic);
            setNewTopic({
                topicName: topic.topicName,
                releaseDate: topic.releaseDate.split('T')[0],
                endDate: topic.endDate.split('T')[0],
            });
        } else {
            setCurrentTopic(null);
            setNewTopic({
                topicName: '',
                releaseDate: '',
                endDate: '',
            });
        }
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentTopic(null);
    };

    const handleFieldChange = (e) => {
        setNewTopic((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const openSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = async () => {
        if (!newTopic.topicName || !newTopic.releaseDate || !newTopic.endDate) {
            openSnackbar('All fields are required.');
            return;
        }

        const formData = new FormData();
        formData.append('topicName', newTopic.topicName);
        formData.append('releaseDate', newTopic.releaseDate);
        formData.append('endDate', newTopic.endDate);
        formData.append('faculty', facultyId);

        try {
            if (currentTopic) {
                await topicService.updateTopic(`${currentTopic._id}`, formData);
            } else {
                await topicService.createTopic(formData);
            }
            onChangeData();
            handleClose();
        } catch (error) {
            console.error('Error saving topic:', error);
        }
    };

    const handleDelete = (topic) => {
        setCurrentTopic(topic.topicName);
        setTopicToDelete(topic._id);
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await topicService.deleteTopic(topicToDelete);
            onChangeData();
        } catch (error) {
            console.error('Error deleting topic:', error);
        } finally {
            setConfirmDeleteOpen(false);
            setTopicToDelete(null);
        }
    };

    const handleView = (topic) => {
        const topicName = encodeURIComponent(topic.topicName);
        navigate(`/umm/topic/${topic._id}/${topicName}/contributions`);
    }

    const filterTopics = (topics) => {
        const today = new Date();
        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(today.getDate() + 3);

        return topics.filter((topic) => {
            const topicEndDate = new Date(topic.endDate);
            const isExpired = topicEndDate < today;
            const isSoonToExpire = topicEndDate <= threeDaysFromNow;

            if (statusFilter === 'expired') {
                return isExpired;
            } else if (statusFilter === 'soonToExpire') {
                return isSoonToExpire && !isExpired;
            } else if (statusFilter === 'active') {
                return !isExpired && !isSoonToExpire;
            }
            return true;
        });
    };

    const filteredTopics = filterTopics(topics);

    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Button variant="contained" color="primary" onClick={() => handleClickOpen(null)}>
                    Add Topic
                </Button>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel shrink>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        <MenuItem value="expired">Expired</MenuItem>
                        <MenuItem value="soonToExpire">Soon to Expire</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <TableContainer component={Paper} style={{ marginTop: '1em' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '40%', fontSize: '1.1rem' }}>Topic Name</TableCell>
                            <TableCell sx={{ width: '22%', fontSize: '1.1rem' }}>Release Date</TableCell>
                            <TableCell sx={{ width: '22%', fontSize: '1.1rem' }}>End Date</TableCell>
                            <TableCell sx={{ width: '16%', fontSize: '1.1rem', textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTopics.length > 0 ? (
                            filteredTopics
                                .map((topic) => {
                                    const today = new Date();
                                    const threeDaysFromNow = new Date(today);
                                    threeDaysFromNow.setDate(today.getDate() + 3);
                                    const isExpired = new Date(topic.endDate) < today;
                                    const isSoonToExpire = new Date(topic.endDate) <= threeDaysFromNow;

                                    return { ...topic, isExpired, isSoonToExpire };
                                })
                                .sort((a, b) => {
                                    if (!a.isExpired && !a.isSoonToExpire && (b.isExpired || b.isSoonToExpire)) return -1;
                                    if (!b.isExpired && !b.isSoonToExpire && (a.isExpired || a.isSoonToExpire)) return 1;
                                    if (a.isSoonToExpire && b.isExpired) return -1;
                                    if (a.isExpired && b.isSoonToExpire) return 1;
                                    return 0;
                                })
                                .map((topic) => {
                                    return (
                                        <TableRow
                                            key={topic._id}
                                            sx={{
                                                backgroundColor: topic.isExpired ? 'rgba(255, 0, 0, 0.2)' :
                                                    topic.isSoonToExpire ? 'rgba(0, 128, 0, 0.2)' :
                                                        'inherit'
                                            }}
                                        >
                                            <TableCell>{topic.topicName}</TableCell>
                                            <TableCell>
                                                <strong>{new Date(topic.releaseDate).toLocaleDateString()}</strong>
                                                {' at ' + new Date(topic.releaseDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </TableCell>
                                            <TableCell>
                                                <strong>{new Date(topic.endDate).toLocaleDateString()}</strong>
                                                {' at ' + new Date(topic.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                    <Button variant="outlined" onClick={() => handleView(topic)}>View</Button>
                                                    <Button variant="outlined" onClick={() => handleClickOpen(topic)}>Edit</Button>
                                                    <Button variant="outlined" color="error" onClick={() => handleDelete(topic)}>Delete</Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No topics created in this faculty.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Dialog for Create/Edit Topic */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentTopic ? 'Edit Topic' : 'Create Topic'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="topicName"
                        label="Topic Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newTopic.topicName}
                        onChange={handleFieldChange}
                    />
                    <TextField
                        margin="dense"
                        name="releaseDate"
                        label="Release Date"
                        type="datetime-local"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        fullWidth
                        variant="outlined"
                        value={newTopic.releaseDate}
                        onChange={handleFieldChange}
                    />
                    <TextField
                        margin="dense"
                        name="endDate"
                        label="End Date"
                        type="datetime-local"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        fullWidth
                        variant="outlined"
                        value={newTopic.endDate}
                        onChange={handleFieldChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="success">
                        {currentTopic ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Modal for Delete */}
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this topic <strong>  &quot;{currentTopic}&quot;</strong> ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

TopicsTable.propTypes = {
    topics: PropTypes.array.isRequired,
    facultyId: PropTypes.string.isRequired,
    onChangeData: PropTypes.func.isRequired,
};

export default TopicsTable;