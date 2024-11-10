import PropTypes from "prop-types";

import { FormControl, Button, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const AvatarUpload = ({ avatarPreview, onAvatarChange, disabled }) => (
    <FormControl fullWidth required sx={{ mb: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        {avatarPreview && (
            <img
                src={avatarPreview}
                alt="Avatar Preview"
                style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }}
            />
        )}
        <Button
            disabled={disabled}
            variant="contained"
            color="primary"
            component="label"
            sx={{ textTransform: 'none', padding: '6px 10px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            startIcon={<CloudUpload />}
        >
            {disabled ? 'Uploading...' : 'Upload Avatar'}
            <input
                disabled={disabled}
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                style={{ display: 'none' }}
            />
        </Button>
    </FormControl>
);
AvatarUpload.propTypes = {
    avatarPreview: PropTypes.string,
    onAvatarChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};


const SelectField = ({ label, value, onChange, options, fetchingData, disabled }) => (
    <FormControl fullWidth required sx={{ mb: 2 }} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select value={value} onChange={onChange}>
            {fetchingData ? (
                <MenuItem disabled>
                    <CircularProgress size={24} />
                </MenuItem>
            ) : (
                options.map(option => (
                    <MenuItem key={option._id} value={option._id} sx={{ "&:hover": { fontWeight: "bold" } }}>
                        {option.roleName || option.facultyName}
                    </MenuItem>
                ))
            )}
        </Select>
    </FormControl>
);

SelectField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    fetchingData: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
}

export {
    AvatarUpload,
    SelectField,
}