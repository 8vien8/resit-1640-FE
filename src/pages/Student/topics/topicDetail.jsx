import { useState, useEffect, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import useContributionService from "../../../services/contributionsServices";
import { UserContext } from "../../../context/UserContext";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
    List, ListItem, ListItemIcon, ListItemText, Container
} from '@mui/material';
import wordIcon from '../../../assets/word.ico'
import imageIcon from '../../../assets/image.ico'
import defaultIcon from '../../../assets/default.ico'
import pdfIcon from '../../../assets/pdf.ico'

const TopicDetail = () => {
    const { topicId, topicName } = useParams();
    const [fetchedData, hasFetchedData] = useState(false);
    const [contributions, setContributions] = useState([]);
    const contributionsService = useContributionService();
    const { user } = useContext(UserContext);
    const studentId = user._id;
    const facultyId = user.facultyID;

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'application/pdf':
                return <img src={pdfIcon} alt="PDF icon" style={{ width: 20, height: 20 }} />;
            case 'image/jpeg':
            case 'image/png':
                return <img src={imageIcon} alt="Image icon" style={{ width: 20, height: 20 }} />;
            case 'application/docs':
                return <img src={wordIcon} alt="Word icon" style={{ width: 20, height: 20 }} />;
            default:
                return <img src={defaultIcon} alt="Default icon" style={{ width: 20, height: 20 }} />;
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const data = await contributionsService.getContributionForStudent(studentId, facultyId, topicId);
            setContributions(data);
        } catch (error) {
            console.error("Error fetching contributions: ", error);
        }
    }, [contributionsService, facultyId, studentId, topicId]);

    useEffect(() => {
        if (!fetchedData) {
            fetchData();
            hasFetchedData(true);
        }
    }, [fetchData, fetchedData]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center">
                Topic: <strong> {topicName}</strong>
            </Typography>
            {contributions.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Title</strong></TableCell>
                                <TableCell><strong>Content</strong></TableCell>
                                <TableCell><strong>Submission Date</strong></TableCell>
                                <TableCell><strong>Files</strong></TableCell>
                                <TableCell><strong>Feedback</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contributions.map((contribution) => (
                                <TableRow key={contribution._id}>
                                    <TableCell>{contribution.title}</TableCell>
                                    <TableCell>{contribution.content}</TableCell>
                                    <TableCell>{new Date(contribution.submissionDate).toLocaleString()}</TableCell>
                                    <TableCell>
                                        {contribution.files && contribution.files.length > 0 ? (
                                            <List>
                                                {contribution.files.map((file) => (
                                                    <ListItem key={file._id}>
                                                        <ListItemIcon>
                                                            {getFileIcon(file.fileType)}
                                                        </ListItemIcon>
                                                        <ListItemText>
                                                            <a href={file.filePath} target="_blank" rel="noopener noreferrer">
                                                                {file.fileName}
                                                            </a>
                                                        </ListItemText>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography variant="body1">No files attached</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{contribution.comments}</TableCell>
                                    <TableCell>{contribution.statusID}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="h6" gutterBottom>
                    No contributions found for this topic.
                </Typography>
            )}
        </Container>
    );
};

export default TopicDetail;