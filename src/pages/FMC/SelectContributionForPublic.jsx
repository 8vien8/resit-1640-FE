import { useEffect, useState } from 'react';
import { getPublicContributions, deletePublicContribution } from '../../services/publicContributionService';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Snackbar,
    Alert,
    ListItemText,
    CircularProgress, List, ListItem, ListItemIcon, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import wordIcon from '../../assets/word.ico';
import imageIcon from '../../assets/image.ico';
import defaultIcon from '../../assets/default.ico';
import pdfIcon from '../../assets/pdf.ico';

const PublicContributionTable = () => {
    const [publicContributions, setPublicContributions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [contributionToDelete, setContributionToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getPublicContributions();
                setPublicContributions(data);
            } catch (err) {
                setError(err.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async () => {
        try {
            if (contributionToDelete) {
                await deletePublicContribution(contributionToDelete);
                setPublicContributions((prev) => prev.filter((item) => item._id !== contributionToDelete));
                setSuccessMessage('Deleted successfully!');
                setDialogOpen(false); // Close the dialog after deletion
            }
        } catch (err) {
            setError(err.message || 'Error deleting contribution');
        }
    };

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

    const truncateFileName = (name) => {
        return name.length > MAX_FILE_NAME_LENGTH ? `${name.substring(0, MAX_FILE_NAME_LENGTH)}...` : name;
    };
    const iconStyles = { width: 50, height: 50 };
    const MAX_FILE_NAME_LENGTH = 30;

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

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Public Contributions
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Contribution</TableCell>
                                <TableCell>Published Date</TableCell>
                                <TableCell>Files</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {publicContributions.length > 0 ? (
                                publicContributions.map((item, index) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{index}</TableCell>
                                        <TableCell>
                                            {/* Display specific fields from the nested contributionID object */}
                                            <div>
                                                <strong>Title:</strong> {item.contributionID?.title}
                                            </div>
                                            <div>
                                                <strong>Content:</strong> {item.contributionID?.content}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {/* Display formatted publishedDate */}
                                            {item.publishedDate
                                                ? new Date(item.publishedDate).toLocaleDateString()
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>{renderFiles(item.contributionID?.files)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => {
                                                    setContributionToDelete(item._id);
                                                    setDialogOpen(true);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
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
            )}
            {/* Show error snackbar */}
            {error && (
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                    <Alert severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                </Snackbar>
            )}
            {/* Show success snackbar */}
            {successMessage && (
                <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
                    <Alert severity="success" onClose={() => setSuccessMessage('')}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this contribution?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PublicContributionTable;
