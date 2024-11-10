import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import PropTypes from 'prop-types';

const styles = {
    primaryBlue: "#2196F3",
    primaryGreen: "#4CAF50",
    primaryOrange: "#DD730C",
    lightGray: "#CCCCCC",
    white: "#FFFFFF",
};

const TopicDialog = ({ open, onClose, onSubmit, currentTopic, newTopic, handleFieldChange }) => {
    return (
        <Dialog sx={{ borderRadius: 8 }} open={open} onClose={onClose}>
            <DialogTitle sx={{ mb: 2, backgroundColor: styles.primaryOrange, color: styles.white }} align="center">{currentTopic ? 'Edit Topic' : 'Create Topic'}</DialogTitle>
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
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        }
                    }}
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
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        }
                    }}
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