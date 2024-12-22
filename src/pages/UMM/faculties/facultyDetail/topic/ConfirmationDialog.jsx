// ConfirmationDialog.js
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import PropTypes from 'prop-types';
const styles = {
    primaryBlue: "#2196F3",
    primaryGreen: "#4CAF50",
    primaryOrange: "#DD730C",
    lightGray: "#CCCCCC",
    white: "#FFFFFF",
};
const ConfirmationDialog = ({ open, onClose, onConfirm, currentTopic }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ mb: 2, backgroundColor: styles.primaryOrange, color: styles.white }}>Confirm Deletion</DialogTitle>
            <DialogContent>
                Are you sure you want to delete this topic and all contributions belong to this topics <strong>&quot;{currentTopic}&quot;</strong>?
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={onConfirm} color="error">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmationDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    currentTopic: PropTypes.string,
};

export default ConfirmationDialog;