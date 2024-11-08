import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';

const TopicsTable = ({ topics, onView, onUpdate }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [updatedTopic, setUpdatedTopic] = useState({
        topicName: '',
        releaseDate: '',
        endDate: ''
    });

    const handleOpenDialog = (topic) => {
        setCurrentTopic(topic);
        setUpdatedTopic({
            topicName: topic.topicName,
            releaseDate: topic.releaseDate,
            endDate: topic.endDate
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentTopic(null);
    };

    const handleUpdate = async () => {
        if (currentTopic) {
            await onUpdate(currentTopic._id, updatedTopic); // Call update function passed as a prop
            handleCloseDialog();
        }
    };

    const sortedTopics = topics.map((topic) => {
        const today = new Date();
        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(today.getDate() + 3);
        const isExpired = new Date(topic.endDate) < today;
        const isSoonToExpire = new Date(topic.endDate) <= threeDaysFromNow;

        return { ...topic, isExpired, isSoonToExpire };
    }).sort((a, b) => {
        // Sorting logic as before
        if (!a.isExpired && !a.isSoonToExpire && (b.isExpired || b.isSoonToExpire)) return -1;
        if (!b.isExpired && !b.isSoonToExpire && (a.isExpired || a.isSoonToExpire)) return 1;
        if (a.isSoonToExpire && b.isExpired) return -1;
        return 0;
    });

    return (
        <>
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
                        {sortedTopics.length > 0 ? (
                            sortedTopics.map((topic) => (
                                <TableRow
                                    key={topic._id}
                                    sx={{
                                        backgroundColor: topic.isExpired ? 'rgba(255, 0, 0, 0.2)' :
                                            topic.isSoonToExpire ? 'rgba(0, 128, 0, 0.2)' : 'inherit'
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
                                            <Button variant="outlined" onClick={() => onView(topic)}>View</Button>
                                            <Button variant="outlined" onClick={() => handleOpenDialog(topic)}>Update</Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No topics found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Update Topic Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle align="center">Update Topic: {updatedTopic.topicName}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="End Date"
                        type="datetime-local"
                        value={updatedTopic.endDate}
                        onChange={(e) => setUpdatedTopic({ ...updatedTopic, endDate: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                    <Button onClick={handleUpdate} color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

TopicsTable.propTypes = {
    topics: PropTypes.array.isRequired,
    onView: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
}

export default TopicsTable;