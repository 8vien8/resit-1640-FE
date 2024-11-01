import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar
} from '@mui/material';
import useTopicService from '../../../services/topicService';
import useUserService from '../../../services/userManagementService';

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
                    <Typography variant="h6" style={{ marginTop: '1em' }}>Topics:</Typography>
                    <TableContainer component={Paper} style={{ marginTop: '1em' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Topic Name</TableCell>
                                    <TableCell>Faculty</TableCell>
                                    <TableCell>Release Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {topics.length > 0 ? (
                                    topics.map(topic => (
                                        <TableRow key={topic._id}>
                                            <TableCell>{topic.topicName}</TableCell>
                                            <TableCell>{topic.faculty?.facultyName}</TableCell>
                                            <TableCell>{new Date(topic.releaseDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(topic.endDate).toLocaleDateString()}</TableCell>
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

                    <Typography variant="h6">Users:</Typography>
                    <TableContainer component={Paper} style={{ marginTop: '1em' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Avatar</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <TableRow key={user._id}>
                                            <TableCell>
                                                <Avatar alt={user.username} src={user.avatar} />
                                            </TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.roleID?.roleName}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No users found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Container>
    );
};

export default FacultyDetailView;