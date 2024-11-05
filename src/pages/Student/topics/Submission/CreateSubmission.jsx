import { useState, useContext } from 'react';
import { UserContext } from '../../../../context/UserContext';
import {
    Container, TextField, Button, FormControlLabel, Checkbox, Box,
    Typography, Paper, Snackbar, Alert
} from '@mui/material';
import { useParams } from 'react-router-dom';
import useContributionService from '../../../../services/contributionsServices';

const CreateSubmission = () => {
    const { topicId } = useParams();
    const { user } = useContext(UserContext);
    const userId = user._id;
    const facultyId = user.facultyID;
    const contributionService = useContributionService();

    const [submissionData, setSubmissionData] = useState({
        userID: userId,
        facultyID: facultyId,
        topicID: topicId,
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
            title: '',
            content: '',
            agreedToTnC: false,
            files: []
        });
    };

    return (
        <Container component={Paper} sx={{ padding: 3, marginTop: 3 }}>
            <Typography variant="h5" gutterBottom>
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
                <Box sx={{ marginTop: 2 }}>
                    {submissionData.files.map((file, index) => (
                        <Typography key={index} variant="body2">{file.name}</Typography>
                    ))}
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