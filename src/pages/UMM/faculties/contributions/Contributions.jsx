import { useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import useContributionService from "../../../../services/contributionsServices";
import { Card, CardContent, Typography, Box, Container, List, ListItem, ListItemText, ListItemIcon, useTheme } from "@mui/material";
import pdfIcon from '../../../../assets/pdf.ico'
import wordIcon from '../../../../assets/word.ico'
import imageIcon from '../../../../assets/image.ico'
import defaultIcon from '../../../../assets/default.ico'
function ContributionsInFaculty() {
    const { topicId, topicName } = useParams();
    const [hasFetchData, setHasFetchedData] = useState(false);
    const contributionsServices = useContributionService();
    const [contributions, setContributions] = useState([]);

    // Fetch contributions based on topicId
    const fetchData = useCallback(async () => {
        try {
            const contributions = await contributionsServices.getContributionByTopicId(topicId);
            setContributions(contributions);
        } catch (err) {
            console.error("Error fetching contributions: ", err);
        }
    }, [contributionsServices, topicId]);

    useEffect(() => {
        if (!hasFetchData) {
            fetchData();
            setHasFetchedData(true);
        }
    }, [fetchData, hasFetchData]);

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'application/pdf':
                return <img src={pdfIcon} />;
            case 'image/jpeg':
            case 'image/png':
                return <img src={imageIcon} />;
            case 'application/docs':
                return <img src={wordIcon} />;
            default:
                return <img src={defaultIcon} />;
        }
    };
    const theme = useTheme();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return theme.palette.primary.main;
            case 'Approved':
                return theme.palette.success.main;
            case 'Rejected':
                return theme.palette.error.main;
            default:
                return theme.palette.text.secondary;
        }
    };

    return (
        <Container >
            <Typography variant="h4" gutterBottom>
                Contributions for Topic: {topicName}
            </Typography>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" >
                {contributions.map((contribution) => (
                    <Box
                        key={contribution._id}
                        mb={2}
                        width="30%"
                    >
                        <Card variant="outlined">
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '300px',
                                    overflow: 'hidden',
                                    bgcolor: '#f9f9f9',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    boxShadow: 2,
                                    padding: 2,
                                }}
                            >
                                <Typography variant="h5" component="div" fontWeight="bold" color="primary">
                                    {contribution.title}
                                </Typography>
                                <Typography color="text.secondary" sx={{ marginBottom: 1 }}>
                                    Submitted by: <span style={{ fontWeight: 'bold' }}>{contribution.userID?.username}</span>
                                </Typography>
                                <Typography variant="body2" sx={{ marginBottom: 1, color: getStatusColor(contribution.statusID?.statusName) }}>
                                    Status: <span style={{ fontWeight: 'bold' }}>{contribution.statusID?.statusName}</span>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                                    Submitted at: <span style={{ fontWeight: 'bold' }}>{new Date(contribution.submissionDate).toLocaleString()}</span>
                                </Typography>

                                <Box sx={{ overflow: 'auto', flexGrow: 1, padding: 1, backgroundColor: '#fff', borderRadius: '4px', boxShadow: 1 }}>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Content:</strong> {contribution.content}
                                    </Typography>

                                    <Typography variant="body2" fontWeight="bold">
                                        Uploaded Files:
                                    </Typography>
                                    <List>
                                        {contribution.files.map((file, index) => (
                                            <ListItem key={index} divider>
                                                <ListItemIcon>
                                                    {getFileIcon(file.fileType)}
                                                </ListItemIcon>
                                                <ListItemText>
                                                    <Typography variant="body2" color="primary">
                                                        <a href={file.filePath} target="_blank" rel="noopener noreferrer">
                                                            <strong>{file.fileName}</strong>
                                                        </a>
                                                    </Typography>
                                                </ListItemText>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Container >
    );
}

export default ContributionsInFaculty;