import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../../context/UserContext';
import useContributionService from '../../../../services/contributionsServices';
import wordIcon from '../../../../assets/word.ico';
import imageIcon from '../../../../assets/image.ico';
import defaultIcon from '../../../../assets/default.ico';
import pdfIcon from '../../../../assets/pdf.ico';
import {
    Container, TextField, Button, FormControlLabel, Checkbox, Box,
    Typography, Paper, Snackbar, Alert, List, ListItem, ListItemIcon, ListItemText, IconButton
} from '@mui/material';
import { UploadFile, Delete } from '@mui/icons-material';

const iconStyles = { width: 50, height: 50 };
const CreateSubmission = () => {
    const { topicId } = useParams();
    const { user } = useContext(UserContext);
    const userId = user._id;
    const facultyId = user.facultyID;
    const contributionService = useContributionService();
    const statusID = '64f000000000000000000041';

    const [submissionData, setSubmissionData] = useState({
        userID: userId,
        facultyID: facultyId,
        topicID: topicId,
        statusID: statusID,
        title: '',
        content: '',
        agreedToTnC: false,
        files: []
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setSubmissionData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.filter(file =>
            !submissionData.files.some(f => f.name === file.name)
        );

        setSubmissionData(prevState => ({
            ...prevState,
            files: [...prevState.files, ...newFiles]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submissionData.files.length === 0) {
            setSnackbarOpen(true);
            setSnackbarMessage('Please upload at least one file.');
            setSnackbarSeverity('warning');
            return;
        }

        const data = new FormData();
        for (const key in submissionData) {
            if (key !== 'files') {
                data.append(key, submissionData[key]);
            }
        }
        submissionData.files.forEach((file) => {
            data.append('files', file);
        });

        try {
            await contributionService.createContribution(data);
            setSnackbarOpen(true);
            setSnackbarMessage('Submission created successfully!');
            setSnackbarSeverity('success');
            resetForm();
        } catch (error) {
            console.error('Error creating submission:', error);
            setSnackbarOpen(true);
            setSnackbarMessage('Failed to create submission.');
            setSnackbarSeverity('error');
        }
    };

    const resetForm = () => {
        setSubmissionData({
            userID: userId,
            facultyID: facultyId,
            topicID: topicId,
            statusID: statusID,
            title: '',
            content: '',
            agreedToTnC: false,
            files: []
        });
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

    const handleRemoveFile = (fileToRemove) => {
        setSubmissionData(prevState => ({
            ...prevState,
            files: prevState.files.filter(file => file.name !== fileToRemove.name)
        }));
    };

    const renderFileList = () => (
        <List>
            {submissionData.files.map((file, index) => (
                <ListItem key={index}>
                    <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
                    <ListItemText>
                        {file.name}
                    </ListItemText>
                    <IconButton color='error' edge="end" onClick={() => handleRemoveFile(file)}>
                        <Delete />
                    </IconButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <Container component={Paper} sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom align='center'>
                Create Submission
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Title"
                    name="title"
                    value={submissionData.title}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    label="Content"
                    name="content"
                    value={submissionData.content}
                    onChange={handleChange}
                    required
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="agreedToTnC"
                            checked={submissionData.agreedToTnC}
                            onChange={handleChange}
                            required
                        />
                    }
                    label="I agree to the Terms and Conditions"
                />
                <Button
                    variant="contained"
                    component="label"
                    sx={{ marginTop: 2 }}
                    startIcon={<UploadFile />}
                >
                    Upload Files
                    <input
                        type="file"
                        multiple
                        hidden
                        name="files"
                        accept="*/*"
                        onChange={handleFileChange}
                    />
                </Button>
                <Box style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {renderFileList()}
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                >
                    Submit
                </Button>
            </form>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CreateSubmission;