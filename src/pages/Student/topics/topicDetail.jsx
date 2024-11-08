import { useState, useEffect, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import useContributionService from "../../../services/contributionsServices";
import { UserContext } from "../../../context/UserContext";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography, List, ListItem,
    ListItemIcon, ListItemText, Container, Button, Snackbar, Alert,
    CircularProgress
} from '@mui/material';
import wordIcon from '../../../assets/word.ico';
import imageIcon from '../../../assets/image.ico';
import defaultIcon from '../../../assets/default.ico';
import pdfIcon from '../../../assets/pdf.ico';
import UpdateSubmission from "./Submission/UpdateSubmission";

const TopicDetail = () => {
    const { topicId, topicName, endDate } = useParams();
    const [contributions, setContributions] = useState([]);
    const contributionsService = useContributionService();
    const { user } = useContext(UserContext);
    const studentId = user._id;
    const facultyId = user.facultyID;

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedContribution, setSelectedContribution] = useState(null);
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [hasFetchedData, setHasFetchedData] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await contributionsService.getContributionForStudent(studentId, facultyId, topicId);
            setContributions(data);
        } catch (error) {
            console.error("Error fetching contributions: ", error);
            setSnackbarState({ open: true, message: 'Error fetching contributions.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, [contributionsService, facultyId, studentId, topicId]);

    useEffect(() => {
        if (!hasFetchedData) {
            fetchData();
            setHasFetchedData(true);
        }
    }, [fetchData, hasFetchedData]);

    const handleOpen = (contribution) => {
        setSelectedContribution(contribution);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedContribution(null);
    };

    const handleUpdate = async ({ id, data }) => {
        try {
            await contributionsService.updateContribution(id, data);
            await fetchData();
            handleClose();
            setSnackbarState({ open: true, message: 'Contribution updated successfully.', severity: 'success' });
        } catch (error) {
            console.error("Error updating contribution: ", error);
            setSnackbarState({ open: true, message: 'Error updating contribution.', severity: 'error' });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarState({ ...snackbarState, open: false });
    };

    const getFileIcon = (fileType) => {
        const iconStyle = { width: 50, height: 50 };
        const iconMap = {
            'application/pdf': pdfIcon,
            'image/jpeg': imageIcon,
            'image/png': imageIcon,
            'application/msword': wordIcon,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': wordIcon
        };
        return <img src={iconMap[fileType] || defaultIcon} alt={`${fileType} icon`} style={iconStyle} />;
    };

    const renderContributionRows = () => {
        return contributions.map((contribution) => (
            <TableRow key={contribution._id}>
                <TableCell>{contribution.title}</TableCell>
                <TableCell>{contribution.content}</TableCell>
                <TableCell>{new Date(contribution.submissionDate).toLocaleString()}</TableCell>
                <TableCell>{renderFiles(contribution.files)}</TableCell>
                <TableCell>{contribution.comments}</TableCell>
                <TableCell>{contribution.statusID?.statusName}</TableCell>
                <TableCell>
                    {new Date(endDate) > new Date() && (
                        <Button onClick={() => handleOpen(contribution)} variant="outlined" color="primary">
                            Update
                        </Button>
                    )}
                </TableCell>
            </TableRow>
        ));
    };

    const renderFiles = (files) => (
        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {files && files.length > 0 ? (
                <List>
                    {files.map((file) => (
                        <ListItem key={file._id}>
                            <ListItemIcon>{getFileIcon(file.fileType)}</ListItemIcon>
                            <ListItemText sx={{ maxHeight: '50px', overflowY: 'hidden' }}>
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
        </div>
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center">
                Topic: <strong>{topicName} </strong>
            </Typography>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <CircularProgress />
                </div>
            ) : contributions.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '20%' }}><strong>Title</strong></TableCell>
                                <TableCell style={{ width: '30%' }}><strong>Content</strong></TableCell>
                                <TableCell style={{ width: '15%' }}><strong>Submission Date</strong></TableCell>
                                <TableCell style={{ width: '20%' }}><strong>Files</strong></TableCell>
                                <TableCell style={{ width: '10%' }}><strong>Feedback</strong></TableCell>
                                <TableCell style={{ width: '5%' }}><strong>Status</strong></TableCell>
                                <TableCell style={{ width: '5%' }}><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderContributionRows()}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="h6" gutterBottom>
                    No contributions found for this topic.
                </Typography>
            )}
            {selectedContribution && (
                <UpdateSubmission
                    open={open}
                    onClose={handleClose}
                    contribution={selectedContribution}
                    onUpdate={handleUpdate}
                />
            )}
            <Snackbar open={snackbarState.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarState.severity}>
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TopicDetail;