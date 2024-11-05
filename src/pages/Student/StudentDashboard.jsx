import { useCallback, useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import useTopicService from '../../services/topicService';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Box, FormControl, Select, MenuItem, InputLabel, Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { user } = useContext(UserContext);
    const topicService = useTopicService();
    const [topics, setTopics] = useState([]);
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const topicsData = await topicService.getTopicByFacultyId(user.facultyID);
            setTopics(topicsData);
        } catch (error) {
            console.error("Error fetching topics: ", error);
        }
    }, [topicService, user.facultyID]);

    useEffect(() => {
        if (!hasFetchedData) {
            fetchData();
            setHasFetchedData(true);
        }
    }, [hasFetchedData, fetchData]);

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

    const handleView = (topic) => {
        const topicName = encodeURIComponent(topic.topicName);
        navigate(`/student/topic/${topic._id}/${topicName}`);
    };

    const handleCreateSubmission = (topic) => {
        const topicName = encodeURIComponent(topic.topicName);
        navigate(`/student/topic/${topic._id}/${topicName}/create-submission`);
    };

    return (
        <Container>
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
                            filteredTopics.map((topic) => {
                                const today = new Date();
                                const threeDaysFromNow = new Date(today);
                                threeDaysFromNow.setDate(today.getDate() + 3);
                                const isExpired = new Date(topic.endDate) < today;
                                const isSoonToExpire = new Date(topic.endDate) <= threeDaysFromNow;

                                return { ...topic, isExpired, isSoonToExpire };
                            }).sort((a, b) => {
                                if (!a.isExpired && !a.isSoonToExpire && (b.isExpired || b.isSoonToExpire)) return -1;
                                if (!b.isExpired && !b.isSoonToExpire && (a.isExpired || a.isSoonToExpire)) return 1;
                                if (a.isSoonToExpire && b.isExpired) return -1;
                                if (a.isExpired && b.isSoonToExpire) return 1;
                                return 0;
                            }).map((topic) => {
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
                                                {!topic.isExpired && (
                                                    <Button variant="outlined" onClick={() => handleCreateSubmission(topic)}>Create </Button>
                                                )}
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
        </Container>
    );
};

export default StudentDashboard;