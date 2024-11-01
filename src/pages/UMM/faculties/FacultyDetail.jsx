import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import useTopicService from '../../../services/topicService';
import useUserService from '../../../services/userManagementService';
import TopicsTable from './facultyDetail/TopicsTable';
import UsersTable from './facultyDetail/UsersTable';

const FacultyDetailView = () => {
    const { facultyId, facultyName } = useParams();
    const topicService = useTopicService();
    const userService = useUserService();

    const [users, setUsers] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasFetchedData, setHasFetchedData] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!hasFetchedData) {
                try {
                    const [userData, topicData] = await Promise.all([
                        userService.getUsersByFaculty(facultyId),
                        topicService.getTopicByFacultyId(facultyId)
                    ]);
                    setUsers(userData);
                    setTopics(topicData);
                    setHasFetchedData(true);
                } catch (err) {
                    setError('Error fetching faculty details. Please try again.', err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [facultyId, topicService, userService, hasFetchedData]);

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
                    <TopicsTable topics={topics} /> {/* Use TopicsTable component */}

                    <Typography variant="h6" style={{ marginTop: '1em' }}>Users:</Typography>
                    <UsersTable users={users} /> {/* Use UsersTable component */}
                </>
            )}
        </Container>
    );
};

export default FacultyDetailView;