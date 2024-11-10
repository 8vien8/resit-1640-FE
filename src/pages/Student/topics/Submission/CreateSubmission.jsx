import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../../context/UserContext';
import useContributionService from '../../../../services/contributionsServices';
import wordIcon from '../../../../assets/word.ico';
import imageIcon from '../../../../assets/image.ico';
import defaultIcon from '../../../../assets/default.ico';
import pdfIcon from '../../../../assets/pdf.ico';
import TermsAndConditions from '../../TermsAndConditions';
import {
    Container, TextField, Button, FormControlLabel, Checkbox, Box,
    Typography, Paper, Snackbar, Alert, List, ListItem, ListItemIcon, ListItemText, IconButton,
} from '@mui/material';
import { UploadFile, Delete } from '@mui/icons-material';

const CreateSubmission = () => {
    const { topicId, topicName } = useParams();
    const { user } = useContext(UserContext);
    const contributionService = useContributionService();
    const userId = user._id;
    const facultyId = user.facultyID;

    const [submissionData, setSubmissionData] = useState({
        userID: userId,
        facultyID: facultyId,
        topicID: topicId,
        title: '',
        content: '',
        agreedToTnC: false,
        files: []
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [modalOpen, setModalOpen] = useState(false);

    const handleChange = ({ target: { name, type, checked, value } }) => {
        setSubmissionData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.filter(file => {
            const validTypes = [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            if (validTypes.includes(file.type) && !submissionData.files.some(f => f.name === file.name)) {
                return true;
            } else {
                showSnackbar(`File "${file.name}" is not a valid type.`, 'warning');
                return false;
            }
        });

        setSubmissionData(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submissionData.files.length === 0) {
            showSnackbar('Please upload at least one file.', 'warning');
            return;
        }

        const data = new FormData();
        Object.entries(submissionData).forEach(([key, value]) => {
            if (key !== 'files') data.append(key, value);
        });
        submissionData.files.forEach(file => data.append('files', file));

        try {
            await contributionService.createContribution(data);
            showSnackbar('Submission created successfully!', 'success');
            resetForm();
        } catch (error) {
            console.error('Error creating submission:', error);
            showSnackbar('Failed to create submission.', 'error');
        }
    };

    const resetForm = () => {
        setSubmissionData({
            userID: userId,
            facultyID: facultyId,
            topicID: topicId,
            title: '',
            content: '',
            agreedToTnC: false,
            files: []
        });
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const getFileIcon = (fileType) => {
        const icons = {
            'application/pdf': pdfIcon,
            'image/jpeg': imageIcon,
            'image/png': imageIcon,
            'application/msword': wordIcon,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': wordIcon,
            default: defaultIcon
        };
        return <img src={icons[fileType] || icons.default} alt="File icon" style={{ width: 50, height: 50 }} />;
    };

    const handleRemoveFile = (fileToRemove) => {
        setSubmissionData(prev => ({ ...prev, files: prev.files.filter(file => file.name !== fileToRemove.name) }));
    };

    const renderFileList = () => (
        <List>
            {submissionData.files.map((file, index) => (
                <ListItem key={index}>
                    <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
                    <ListItemText primary={file.name} />
                    <IconButton color='error' edge="end" onClick={() => handleRemoveFile(file)}>
                        <Delete />
                    </IconButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <Container component={Paper} sx={{ p: 3, mt: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom align="center">
                Create contribution for topic: <strong>{topicName}</strong>
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
                    label={<span style={{ cursor: 'pointer' }} onClick={() => setModalOpen(true)}>I agree to the Terms and Conditions</span>}
                />
                <Button
                    variant="contained"
                    component="label"
                    sx={{ mt: 2, bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                    startIcon={<UploadFile />}
                >
                    Upload Files
                    <input
                        type="file"
                        multiple
                        hidden
                        accept="application/pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileChange}
                    />
                </Button>
                <Box sx={{ mt: 2, maxHeight: '200px', overflowY: 'auto', border: '1px solid', borderColor: 'divider', padding: 1 }}>
                    {renderFileList()}
                </Box>
                <Button type="submit" variant="contained" sx={{ mt: 3, width: '100%', bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                    Submit
                </Button>
            </form>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <TermsAndConditions open={modalOpen} onClose={() => setModalOpen(false)} />
        </Container>
    );
};

export default CreateSubmission;