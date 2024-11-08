import { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box
} from '@mui/material';
import PropTypes from 'prop-types';
import useTopicService from '../../../../../services/topicService';
import { useNavigate } from 'react-router-dom';
import TopicDialog from './TopicDialog';
import ConfirmationDialog from './ConfirmationDialog';
import StatusFilter from './StatusFilter';

const styles = {
    primaryBlue: "#2196F3",
    primaryGreen: "#4CAF50",
    primaryOrange: "#DD730C",
    lightGray: "#CCCCCC",
    white: "#FFFFFF",
};

const TopicsTable = ({ topics, facultyId, onChangeData, onNotify }) => {
    const topicService = useTopicService();
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [newTopic, setNewTopic] = useState({
        topicName: '',
        releaseDate: '',
        endDate: '',
    });

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');

    const handleClickOpen = (topic) => {
        setOpenDialog(true);
        if (topic) {
            setCurrentTopic(topic);
            setNewTopic({
                topicName: topic.topicName,
                releaseDate: topic.releaseDate.split('T')[0],
                endDate: topic.endDate.split('T')[0],
            });
        } else {
            setCurrentTopic(null);
            setNewTopic({ topicName: '', releaseDate: '', endDate: '' });
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentTopic(null);
    };

    const handleFieldChange = (e) => {
        setNewTopic((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    const handleSubmit = async () => {
        if (!newTopic.topicName || !newTopic.releaseDate || !newTopic.endDate) {
            onNotify('All fields are required.', 'warning');
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
                onNotify('Topic updated successfully!', 'success');
            } else {
                await topicService.createTopic(formData);
                onNotify('Topic created successfully!', 'success')
            }
            onChangeData();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving topic:', error);
            onNotify('Error saving topic. Please try again.', 'error');
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
            onNotify('Topic deleted successfully!', 'success');
            onChangeData();
        } catch (error) {
            console.error('Error deleting topic:', error);
            onNotify('Error deleting topic. Please try again.', 'error');
        } finally {
            setConfirmDeleteOpen(false);
            setTopicToDelete(null);
        }
    };

    const handleView = (topic) => {
        const topicName = encodeURIComponent(topic.topicName);
        navigate(`/umm/topic/${topic._id}/${topicName}/contributions`);
    };

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
            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: styles.primaryBlue }} onClick={() => handleClickOpen(null)}>
                    Create Topic
                </Button>
                <StatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
            </Box>
            <TableContainer component={Paper} style={{ marginTop: '1em' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: styles.primaryOrange }}>
                        <TableRow>
                            <TableCell sx={{ width: '40%', fontSize: '1.1rem', color: 'white' }}>Topic Name</TableCell>
                            <TableCell sx={{ width: '22%', fontSize: '1.1rem', color: 'white' }}>Release Date</TableCell>
                            <TableCell sx={{ width: '22%', fontSize: '1.1rem', color: 'white' }}>End Date</TableCell>
                            <TableCell sx={{ width: '16%', fontSize: '1.1rem', textAlign: 'center', color: 'white' }}>Actions</TableCell>
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
                                                '&:hover': { backgroundColor: styles.lightGray },
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
                                                    <Button variant="contained" onClick={() => handleView(topic)}>View</Button>
                                                    <Button variant="contained" color="success" onClick={() => handleClickOpen(topic)}>Edit</Button>
                                                    <Button variant="contained" color="error" onClick={() => handleDelete(topic)}>Delete</Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No topics found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TopicDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
                currentTopic={currentTopic}
                newTopic={newTopic}
                handleFieldChange={handleFieldChange}
            />

            <ConfirmationDialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                currentTopic={currentTopic}
            />
        </div>
    );
};

TopicsTable.propTypes = {
    topics: PropTypes.array.isRequired,
    facultyId: PropTypes.string.isRequired,
    onChangeData: PropTypes.func.isRequired,
    onNotify: PropTypes.func.isRequired,
};

export default TopicsTable;