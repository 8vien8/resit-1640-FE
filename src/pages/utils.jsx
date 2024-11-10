import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

const StatusFilter = ({ statusFilter, setStatusFilter }) => {
    return (
        <FormControl sx={{ minWidth: '120px' }}>
            <InputLabel shrink>Status</InputLabel>
            <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
            >
                <MenuItem value="">
                    <em>All</em>
                </MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="soonToExpire">Soon to Expire</MenuItem>
                <MenuItem value="active">Active</MenuItem>
            </Select>
        </FormControl>
    );
};

StatusFilter.propTypes = {
    statusFilter: PropTypes.string.isRequired,
    setStatusFilter: PropTypes.func.isRequired,
};

export { StatusFilter };