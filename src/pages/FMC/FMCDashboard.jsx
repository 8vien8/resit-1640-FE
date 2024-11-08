import { useCallback, useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import useTopicService from '../../services/topicService';
import useUserService from "../../services/userManagementService";
import {
    Container, FormControl, Select, MenuItem, InputLabel, Typography,
    CircularProgress, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TopicsTable from './topic/TopicsTable';
import UsersTable from "../UMM/faculties/facultyDetail/user/UsersTable";

const FMCDashBoard = () => {
    const { user } = useContext(UserContext);
    const topicService = useTopicService();
    const userService = useUserService();
    const [topics, setTopics] = useState([]);
    const [users, setUsers] = useState([]);
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [topicsData, usersData] = await Promise.all([
                topicService.getTopicByFacultyId(user.facultyID),
                userService.getUsersByFaculty(user.facultyID)
            ]);
            setTopics(topicsData);
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching topics: ", error);
        } finally {
            setLoading(false);
        }
    }, [topicService, user.facultyID, userService]);

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
        const endDate = encodeURIComponent(topic.endDate);
        navigate(`/fmc/topic/${topic._id}/${topicName}/${endDate}`);
    };

    const handleUpdateTopic = async (topicId, updatedData) => {
        setLoading(true);
        try {
            await topicService.updateTopic(topicId, updatedData);
            await fetchData();
        } catch (error) {
            console.error("Error updating topic: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Box align='center'>
                    <CircularProgress />
                </Box>
            ) : (
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

                    <TopicsTable
                        topics={filteredTopics}
                        onView={handleView}
                        onUpdate={handleUpdateTopic}
                    />

                    <Typography variant="h6" style={{ marginTop: '1em' }}>Students</Typography>
                    <UsersTable users={users} />
                </Container>
            )}
        </>
    );
};

export default FMCDashBoard;