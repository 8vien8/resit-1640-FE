import { useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import useContributionService from "../../../../../../services/contributionsServices";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
    List, ListItem, ListItemText, ListItemIcon, useTheme, Container, FormControl, InputLabel, Select, MenuItem,
    CircularProgress, Button, Box
} from "@mui/material";
import pdfIcon from '../../../../../../assets/pdf.ico';
import wordIcon from '../../../../../../assets/word.ico';
import imageIcon from '../../../../../../assets/image.ico';
import defaultIcon from '../../../../../../assets/default.ico';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const iconStyles = { width: 50, height: 50 };
const MAX_FILE_NAME_LENGTH = 30;
const styles = {
    primaryOrange: "#DD730C",
    primaryGreen: "#4CAF50",
    primaryBlue: "#2196F3",
    lightGray: "#B0BEC5",
    offWhite: "#F5F5F5",
};

function ContributionsInFaculty() {
    const { topicId, topicName } = useParams();
    const contributionsServices = useContributionService();
    const [contributions, setContributions] = useState([]);
    const [filteredContributions, setFilteredContributions] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const contributions = await contributionsServices.getContributionByTopicId(topicId);
            setContributions(contributions);
            setFilteredContributions(contributions);
            setHasFetchedData(true);
        } catch (err) {
            console.error("Error fetching contributions: ", err);
        } finally {
            setIsLoading(false);
        }
    }, [contributionsServices, topicId]);

    useEffect(() => {
        if (!hasFetchedData) {
            fetchData();
        }
    }, [fetchData, hasFetchedData]);

    useEffect(() => {
        if (statusFilter === 'All') {
            setFilteredContributions(contributions);
        } else {
            setFilteredContributions(contributions.filter(contribution => contribution.statusID?.statusName === statusFilter));
        }
    }, [statusFilter, contributions]);

    const getFileIcon = (fileType) => {
        const icons = {
            'application/pdf': pdfIcon,
            'image/jpeg': imageIcon,
            'image/png': imageIcon,
            'application/msword': wordIcon,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': wordIcon,
        };
        return <img src={icons[fileType] || defaultIcon} alt="File icon" style={iconStyles} />;
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

    const renderContributionRows = () => {
        return filteredContributions.map((contribution) => (
            <TableRow key={contribution._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: styles.lightGray } }}>
                <TableCell>
                    <Typography variant="body1" fontWeight="bold" color={styles.primaryBlue}>
                        {contribution.title}
                    </Typography>
                </TableCell>
                <TableCell>{contribution.userID?.username}</TableCell>
                <TableCell>
                    <Typography variant="body2" color={getStatusColor(contribution.statusID?.statusName)}>
                        <strong>{contribution.statusID?.statusName}</strong>
                    </Typography>
                </TableCell>
                <TableCell>{new Date(contribution.submissionDate).toLocaleString()}</TableCell>
                <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {contribution.content}
                    </Typography>
                </TableCell>
                <TableCell>{renderFiles(contribution.files)}</TableCell>
                <TableCell>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => downloadFiles(contribution.files)}
                    >
                        Download
                    </Button>
                </TableCell>
            </TableRow>
        ));
    };

    const downloadFiles = async (files) => {
        const zip = new JSZip();
        for (const file of files) {
            const fileUrl = file.filePath;
            const fileName = file.fileName;

            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch file: ${fileName}`);
                }
                const fileBlob = await response.blob();
                zip.file(fileName, fileBlob); // Add the file to the zip
            } catch (err) {
                console.error("Error adding file to zip:", err);
            }
        }

        // Generate the zip file and download it
        zip.generateAsync({ type: 'blob' })
            .then((content) => {
                saveAs(content, "contribution_files.zip"); // Save the zip file
            })
            .catch((err) => {
                console.error("Error generating zip file:", err);
            });
    };

    const downloadAllFiles = async () => {
        const zip = new JSZip();
        for (const contribution of contributions) {
            for (const file of contribution.files) {
                const fileUrl = file.filePath;
                const fileName = file.fileName;

                try {
                    const response = await fetch(fileUrl);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch file: ${fileName}`);
                    }
                    const fileBlob = await response.blob();
                    zip.file(fileName, fileBlob); // Add the file to the zip
                } catch (err) {
                    console.error("Error adding file to zip:", err);
                }
            }
        }

        // Generate the zip file and download it
        zip.generateAsync({ type: 'blob' })
            .then((content) => {
                saveAs(content, "all_contribution_files.zip"); // Save the zip file
            })
            .catch((err) => {
                console.error("Error generating zip file:", err);
            });
    };

    return (
        <Container sx={{ padding: '20px', backgroundColor: styles.offWhite, borderRadius: '8px', boxShadow: theme.shadows[3] }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: styles.primaryBlue }}>
                Contributions for Topic: {topicName}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                <FormControl sx={{ minWidth: '120px' }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={downloadAllFiles}
                >
                    Download All
                </Button>
            </Box>

            {isLoading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: styles.primaryOrange }}>
                                <TableCell sx={{ width: '15%' }}><strong style={{ color: styles.offWhite }}>Title</strong></TableCell>
                                <TableCell sx={{ width: '15%' }}><strong style={{ color: styles.offWhite }}>Submitted by</strong></TableCell>
                                <TableCell sx={{ width: '10%' }}><strong style={{ color: styles.offWhite }}>Status</strong></TableCell>
                                <TableCell sx={{ width: '10%' }}><strong style={{ color: styles.offWhite }}>Submitted at</strong></TableCell>
                                <TableCell sx={{ width: '25%' }}><strong style={{ color: styles.offWhite }}>Content</strong></TableCell>
                                <TableCell sx={{ width: '25%' }}><strong style={{ color: styles.offWhite }}>Files</strong></TableCell>
                                <TableCell sx={{ width: '10%' }}><strong style={{ color: styles.offWhite }}>Download</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderContributionRows()}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}

export default ContributionsInFaculty;
