import { useCallback, useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import useTopicService from '../../services/topicService';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Box, Container, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StatusFilter } from "../utils";

const StudentDashboard = () => {
    const { user } = useContext(UserContext);
    const topicService = useTopicService();
    const [topics, setTopics] = useState([]);
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [statusFilter, setStatusFilter] = useState('')
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

    const sortedTopics = topics.map((topic) => {
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
        return 0;
    }).filter((topic) => {
        const today = new Date();
        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(today.getDate() + 3);

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

    const handleView = (topic) => {
        const topicName = encodeURIComponent(topic.topicName);
        const endDate = encodeURIComponent(topic.endDate);
        navigate(`/student/topic/${topic._id}/${topicName}/${endDate}`);
    };

    const handleCreateSubmission = (topic) => {
        const topicName = encodeURIComponent(topic.topicName);
        navigate(`/student/topic/${topic._id}/${topicName}/create-submission`);
    };

    const styles = {
        primaryBlue: "#2196F3",
        primaryGreen: "#4CAF50",
        primaryOrange: "#DD730C",
        lightGray: "#CCCCCC",
        offWhite: "#FFFFFF",
    };

    return (
        <Container>
            <Typography align='center' variant="h4" gutterBottom >
                Welcome <strong>{user.username}</strong>
            </Typography>
            <TableContainer component={Paper} style={{ marginTop: '1em' }}>

                <StatusFilter
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                <Table>
                    <TableHead sx={{ backgroundColor: styles.primaryOrange }}>
                        <TableRow>
                            <TableCell sx={{ width: '40%', fontSize: '1.1rem', color: styles.offWhite }}>Topic Name</TableCell>
                            <TableCell sx={{ width: '22%', fontSize: '1.1rem', color: styles.offWhite }}>Release Date</TableCell>
                            <TableCell sx={{ width: '22%', fontSize: '1.1rem', color: styles.offWhite }}>End Date</TableCell>
                            <TableCell sx={{ width: '16%', fontSize: '1.1rem', color: styles.offWhite, textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedTopics.length > 0 ? (
                            sortedTopics.map((topic) => {
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
                                                {!topic.isExpired && (
                                                    <Button variant="contained" color="success" onClick={() => handleCreateSubmission(topic)}>Create </Button>
                                                )}
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
        </Container >
    );
};

export default StudentDashboard;