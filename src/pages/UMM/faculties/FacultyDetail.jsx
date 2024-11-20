import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container, Typography, CircularProgress, Alert, Snackbar,
} from '@mui/material';
import useTopicService from '../../../services/topicService';
import useUserService from '../../../services/userManagementService';
import TopicsTable from './facultyDetail/topic/TopicsTable';
import UsersTable from './facultyDetail/user/UsersTable';
import { StatusFilter } from '../../utils';

const FacultyDetailView = () => {
    const { facultyId, facultyName } = useParams();
    const topicService = useTopicService();
    const userService = useUserService();

    const [users, setUsers] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [userData, topicData] = await Promise.all([
                userService.getUsersByFaculty(facultyId),
                topicService.getTopicByFacultyId(facultyId)
            ]);
            setUsers(userData);
            setTopics(topicData);
        } catch (err) {
            setError('Error fetching faculty details. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [facultyId, topicService, userService]);

    useEffect(() => {
        if (!hasFetchedData) {
            fetchData();
            setHasFetchedData(true);
        }
    }, [fetchData, hasFetchedData]);

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleNotify = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
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
        <Container>
            <Typography variant="h4" gutterBottom>{decodeURIComponent(facultyName)}</Typography>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <>
                    <Typography variant="h6" style={{ marginTop: '1em' }}>Topics</Typography>

                    <StatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

                    <TopicsTable topics={filteredTopics} facultyId={facultyId} onChangeData={fetchData} onNotify={handleNotify} />

                    <Typography variant="h6" style={{ marginTop: '1em' }}>Members</Typography>
                    <UsersTable users={users} />
                </>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FacultyDetailView;