import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ReportContent = ({ isReportLoading, reportData, handleExportToExcel }) => {
    return (
        <Box sx={{ mt: 2 }}>
            {isReportLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : reportData && Array.isArray(reportData) ? (
                <Box>
                    {/* Render báo cáo từ reportData */}
                    {reportData
                        .filter(item => item.facultyName !== 'none')
                        .map((item, index) => (
                            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
                                <Typography variant="h6">{item.facultyName}</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2"><strong>Member Count:</strong> {item.memberCount}</Typography>
                                        <Typography variant="body2"><strong>Manager:</strong> {item.manager || 'N/A'}</Typography>
                                        <Typography variant="body2"><strong>Topic Count:</strong> {item.topicCount}</Typography>
                                        <Typography variant="body2"><strong>Contribution Count:</strong> {item.contributionCount}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2"><strong>Approved Count:</strong> {item.approvedCount}</Typography>
                                        <Typography variant="body2"><strong>Rejected Count:</strong> {item.rejectedCount}</Typography>
                                        <Typography variant="body2"><strong>Public Count:</strong> {item.publicCount}</Typography>
                                        <Typography variant="body2"><strong>Coordinator Count:</strong> {item.roleCounts.coordinator}</Typography>
                                        <Typography variant="body2"><strong>Student Count:</strong> {item.roleCounts.student}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant="contained" color="success" onClick={handleExportToExcel}>
                            Export to Excel
                        </Button>
                    </Box>
                </Box>
            ) : null}
        </Box>
    );
};

ReportContent.propTypes = {
    isReportLoading: PropTypes.bool.isRequired,
    reportData: PropTypes.array,
    handleExportToExcel: PropTypes.func.isRequired,
};

export default ReportContent;
