import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../../context/UserContext';
import { useParams } from 'react-router-dom';
import {
    Modal, Button, TextField, Typography, Box, List, ListItem, ListItemText, ListItemIcon, IconButton,
    Snackbar, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import wordIcon from '../../../../assets/word.ico';
import imageIcon from '../../../../assets/image.ico';
import defaultIcon from '../../../../assets/default.ico';
import pdfIcon from '../../../../assets/pdf.ico';
import { CloudUpload } from '@mui/icons-material';

const iconStyles = { width: 50, height: 50 };

const UpdateContribution = ({ open, onClose, contribution, onUpdate }) => {
    const { user } = useContext(UserContext);
    const { topicId } = useParams();
    const userId = user._id;
    const facultyId = user.facultyID;
    const updateUserRole = user.roleID

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (contribution) {
            setTitle(contribution.title);
            setContent(contribution.content);
            // Reset files
            setFiles([]);

            const fetchFiles = async () => {
                const fetchedFiles = await Promise.all(contribution.files.map(async (file) => {
                    const response = await fetch(file.filePath);
                    const blob = await response.blob();
                    return new File([blob], file.fileName, {
                        type: file.fileType,
                        lastModified: Date.now(),
                    });
                }));
                setFiles(fetchedFiles);
            };

            fetchFiles().catch(console.error);
        }
    }, [contribution]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const fileNames = selectedFiles.map(file => file.name);
        const duplicates = fileNames.filter(name => files.some(existingFile => existingFile.name === name));

        if (duplicates.length > 0) {
            showSnackbar(`Files "${duplicates.join(', ')}" already exist.`, 'warning');
            return;
        }

        setFiles(prevFiles => [
            ...prevFiles,
            ...selectedFiles
        ]);
    };

    const handleRemoveFile = (fileToRemove) => {
        setFiles(prevFiles => prevFiles.filter(file => file.name !== fileToRemove.name));
    };

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) {
            showSnackbar("Title and Content are required", "warning");
            return;
        }

        const formData = new FormData();

        formData.append('updateUserRole', updateUserRole);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('userID', userId);
        formData.append('facultyID', facultyId);
        formData.append('topicID', topicId);
        files.forEach(file => formData.append('files', file));

        onUpdate({ id: contribution._id, data: formData });
        showSnackbar("Contribution updated successfully", "success");
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'application/pdf':
                return <img src={pdfIcon} alt="PDF icon" style={iconStyles} />;
            case 'image/jpeg':
            case 'image/png':
                return <img src={imageIcon} alt="Image icon" style={iconStyles} />;
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return <img src={wordIcon} alt="Word icon" style={iconStyles} />;
            default:
                return <img src={defaultIcon} alt="Default icon" style={iconStyles} />;
        }
    };

    const renderFileList = () => (
        <List>
            {files.map((file, index) => (
                <ListItem key={index}>
                    <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
                    <ListItemText>
                        <a href={file.filePath || URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer">
                            {file.name}
                        </a>
                    </ListItemText>
                    <IconButton color='error' edge="end" onClick={() => handleRemoveFile(file)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <>
            <Modal open={open} onClose={onClose} sx={{ alignSelf: 'center' }}>
                <Box sx={{
                    width: 500, margin: 'auto', padding: 2,
                    backgroundColor: 'white', borderRadius: 1,
                    boxShadow: 3,
                }}>
                    <Typography variant="h5" gutterBottom align='center'>
                        Update Contribution
                    </Typography>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                    />
                    <Typography variant="subtitle1">Files:</Typography>
                    <Box style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {renderFileList()}
                    </Box>
                    <Box mt={2} align="center">
                        <input
                            style={{ display: 'none' }}
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            multiple
                        />
                        <label htmlFor="file-upload">
                            <Button startIcon={<CloudUpload />} variant="contained" component="span" color="success">
                                Upload Files
                            </Button>
                        </label>
                    </Box>
                    <Box mt={2} align="center" display="flex" justifyContent="space-between">
                        <Button onClick={onClose} color="error" variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary" variant="contained">
                            Save Updates
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

UpdateContribution.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    contribution: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        files: PropTypes.arrayOf(
            PropTypes.shape({
                fileName: PropTypes.string.isRequired,
                filePath: PropTypes.string,
                fileType: PropTypes.string,
            })
        )
    }),
    onUpdate: PropTypes.func.isRequired,
};

export default UpdateContribution;
