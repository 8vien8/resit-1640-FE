// ConfirmationDialog.js
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import PropTypes from 'prop-types';

const ConfirmationDialog = ({ open, onClose, onConfirm, currentTopic }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                Are you sure you want to delete this topic <strong>&quot;{currentTopic}&quot;</strong>?
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
    currentTopic: PropTypes.string.isRequired,
};

export default ConfirmationDialog;