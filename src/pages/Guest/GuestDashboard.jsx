import { useState, useEffect, useCallback, } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import useContributionService from "../../services/contributionsServices";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography, List, ListItem,
    ListItemIcon, ListItemText, Container, CircularProgress, useTheme
} from '@mui/material';
import wordIcon from '../../assets/word.ico';
import imageIcon from '../../assets/image.ico';
import defaultIcon from '../../assets/default.ico';
import pdfIcon from '../../assets/pdf.ico';

const GuestDashboard = () => {
    const { user } = useContext(UserContext);
    const [contributions, setContributions] = useState([]);
    const contributionsService = useContributionService();

    const [loading, setLoading] = useState(false);
    const [hasFetchedData, setHasFetchedData] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await contributionsService.getContributions();
            setContributions(data);
        } catch (error) {
            console.error("Error fetching contributions: ", error);
        } finally {
            setLoading(false);
        }
    }, [contributionsService]);

    useEffect(() => {
        if (!hasFetchedData) {
            fetchData();
            setHasFetchedData(true);
        }
    }, [fetchData, hasFetchedData]);

    const getFileIcon = (fileType) => {
        const iconMap = {
            'application/pdf': pdfIcon,
            'image/jpeg': imageIcon,
            'image/png': imageIcon,
            'application/msword': wordIcon,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': wordIcon
        };
        return <img src={iconMap[fileType] || defaultIcon} alt={`${fileType} icon`} style={iconStyles} />;
    };
    const theme = useTheme();

    const getStatusColor = (status) => {
        const statusColorMap = {
            'Pending': theme.palette.primary.main,
            'Approved': theme.palette.success.main,
            'Rejected': theme.palette.error.main,
        };
        return statusColorMap[status] || theme.palette.text.secondary;
    };

    const truncateFileName = (name) => {
        return name.length > MAX_FILE_NAME_LENGTH ? `${name.substring(0, MAX_FILE_NAME_LENGTH)}...` : name;
    };

    const renderContributionRows = () => {
        return contributions
            .filter(contribution => contribution.statusID?.statusName === 'Approved')
            .map((contribution) => (
                <TableRow key={contribution._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: styles.lightGray } }}>
                    <TableCell>
                        <Typography variant="body1" fontWeight="bold" color={styles.primaryBlue}>
                            {contribution.title}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {contribution.content}
                        </Typography>
                    </TableCell>
                    <TableCell>{renderFiles(contribution.files)}</TableCell>
                    <TableCell>{contribution.comments}</TableCell>
                    <TableCell >
                        <Typography variant="body2" fontWeight="bold" color={getStatusColor(contribution.statusID?.statusName)}>
                            {contribution.statusID?.statusName}
                        </Typography>
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
                            <ListItemText >
                                <a href={file.filePath} target="_blank" rel="noopener noreferrer">
                                    <strong>{truncateFileName(file.fileName)}</strong>
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

    const iconStyles = { width: 50, height: 50 };
    const MAX_FILE_NAME_LENGTH = 30;
    const styles = {
        primaryOrange: "#DD730C",
        primaryGreen: "#4CAF50",
        primaryBlue: "#2196F3",
        lightGray: "#B0BEC5",
        offWhite: "#F5F5F5",
    };

    return (
        <Container sx={{ padding: '20px', backgroundColor: styles.offWhite, borderRadius: '8px', boxShadow: theme.shadows[3] }}>
            <Typography variant="h4" gutterBottom align="center">
                Welcome {user.username}
            </Typography>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <CircularProgress />
                </div>
            ) : contributions.length > 0 ? (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: styles.primaryOrange }}>
                                <TableCell sx={{ width: '20%', color: styles.offWhite }}><strong >Title</strong></TableCell>
                                <TableCell sx={{ width: '30%', color: styles.offWhite }}><strong >Content</strong></TableCell>
                                <TableCell sx={{ width: '20%', color: styles.offWhite }}><strong >Files</strong></TableCell>
                                <TableCell sx={{ width: '10%', color: styles.offWhite }}><strong >Feedback</strong></TableCell>
                                <TableCell sx={{ width: '5%', color: styles.offWhite }}><strong >Status</strong></TableCell>
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
        </Container>
    );
};

export default GuestDashboard;