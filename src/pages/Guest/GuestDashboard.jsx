import { useState, useEffect, useCallback, } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { getPublicContributions } from '../../services/publicContributionService';
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

    const [loading, setLoading] = useState(false);
    const [hasFetchedData, setHasFetchedData] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getPublicContributions();
            setContributions(data);
        } catch (error) {
            console.error("Error fetching contributions: ", error);
        } finally {
            setLoading(false);
        }
    }, []);

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

    const truncateFileName = (name) => {
        return name.length > MAX_FILE_NAME_LENGTH ? `${name.substring(0, MAX_FILE_NAME_LENGTH)}...` : name;
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
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Contribution</TableCell>
                                <TableCell>Published Date</TableCell>
                                <TableCell>Files</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contributions.length > 0 ? (
                                contributions.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell></TableCell>
                                        <TableCell>
                                            {/* Display specific fields from the nested contributionID object */}
                                            <div>
                                                <strong>Title:</strong> {item.contributionID.title}
                                            </div>
                                            <div>
                                                <strong>Content:</strong> {item.contributionID.content}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {/* Display formatted publishedDate */}
                                            {item.publishedDate
                                                ? new Date(item.publishedDate).toLocaleDateString()
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>{renderFiles(item.contributionID?.files)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No contributions found.
                                    </TableCell>
                                </TableRow>
                            )}
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