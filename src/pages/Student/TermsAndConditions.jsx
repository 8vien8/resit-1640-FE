import PropTypes from 'prop-types';
import { Box, Typography, Container, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const TermsAndConditions = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogContent>
                <Container>
                    <Box my={2}>
                        <Typography variant="h4" gutterBottom>
                            Terms and Conditions
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Welcome to GreenWich. These terms and conditions outline the rules and regulations for the use of GreenWich Website.
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                            1. Introduction
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            By accessing this website we assume you accept these terms and conditions in full. Do not continue to use GreenWich website if you do not accept all of the terms and conditions stated on this page.
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                            2. License to Use Website
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Unless otherwise stated, GreenWich and/or its licensors own the intellectual property rights published on this website and materials used on GreenWich. Subject to the license below, all these intellectual property rights are reserved.
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                            3. Acceptable Use
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                            4. Limitations of Liability
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            GreenWich will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this website: for any indirect, special, or consequential loss; or for any loss of business, revenue, profits, or anticipated savings.
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                            5. Amendments
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            We may revise these terms and conditions from time to time. Revised terms and conditions will apply to the use of our website from the date of the publication of the revised terms and conditions on our website.
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                            6. Governing Law
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            These terms and conditions will be governed by and construed in accordance with the laws of VietNam, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of VietNam.
                        </Typography>

                        <Typography variant="body1" gutterBottom>
                            If you have any questions about these Terms and Conditions, please contact us at +849655298374 or email to helloworld1990@gmail.com.
                        </Typography>
                    </Box>
                </Container>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

TermsAndConditions.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default TermsAndConditions;