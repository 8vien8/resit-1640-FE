import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container, Typography, CircularProgress, Alert, Snackbar,
} from '@mui/material';
import useTopicService from '../../../services/topicService';
import useUserService from '../../../services/userManagementService';
import TopicsTable from './facultyDetail/topic/TopicsTable';
import UsersTable from './facultyDetail/user/UsersTable';

const FacultyDetailView = () => {
    const { facultyId, facultyName } = useParams();
    const topicService = useTopicService();
    const userService = useUserService();

    const [users, setUsers] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasFetchedData, setHasFetchedData] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchData = useCallback(async () => {
        try {
            const [userData, topicData] = await Promise.all([
                userService.getUsersByFaculty(facultyId),
                topicService.getTopicByFacultyId(facultyId)
            ]);
            setUsers(userData);
            setTopics(topicData);
            setHasFetchedData(true);
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
                    <TopicsTable topics={topics} facultyId={facultyId} onChangeData={fetchData} onNotify={handleNotify} />

                    <Typography variant="h6" style={{ marginTop: '1em' }}>Users</Typography>
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