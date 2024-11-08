import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import PropTypes from 'prop-types';

const TopicDialog = ({ open, onClose, onSubmit, currentTopic, newTopic, handleFieldChange }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle align="center">{currentTopic ? 'Edit Topic' : 'Create Topic'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="topicName"
                    label="Topic Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={newTopic.topicName}
                    onChange={handleFieldChange}
                />
                <TextField
                    margin="dense"
                    name="releaseDate"
                    label="Release Date"
                    type="datetime-local"
                    fullWidth
                    variant="outlined"
                    value={newTopic.releaseDate}
                    onChange={handleFieldChange}
                />
                <TextField
                    margin="dense"
                    name="endDate"
                    label="End Date"
                    type="datetime-local"
                    fullWidth
                    variant="outlined"
                    value={newTopic.endDate}
                    onChange={handleFieldChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={onSubmit} color="success">{currentTopic ? 'Update' : 'Create'}</Button>
            </DialogActions>
        </Dialog>
    );
};

TopicDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    currentTopic: PropTypes.object,
    newTopic: PropTypes.object.isRequired,
    handleFieldChange: PropTypes.func.isRequired,
};

export default TopicDialog;