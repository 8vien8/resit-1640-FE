import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
const FilterBar = ({ searchTerm, handleSearchChange, selectedRole, handleRoleFilterChange, roles, selectedFaculty,
    handleFacultyFilterChange, faculties
}) => {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
                label="Search by Username"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <FormControl fullWidth variant="outlined">
                <InputLabel>Filter by Role</InputLabel>
                <Select value={selectedRole} onChange={handleRoleFilterChange} label="Filter by Role">
                    <MenuItem value=""><em>All Roles</em></MenuItem>
                    {roles.map((role) => (
                        <MenuItem key={role._id} value={role.roleName}>
                            {role.roleName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined">
                <InputLabel>Filter by Faculty</InputLabel>
                <Select value={selectedFaculty} onChange={handleFacultyFilterChange} label="Filter by Faculty">
                    <MenuItem value=""><em>All Faculties</em></MenuItem>
                    {faculties.map((faculty) => (
                        <MenuItem key={faculty._id} value={faculty.facultyName}>
                            {faculty.facultyName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

FilterBar.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    handleSearchChange: PropTypes.func.isRequired,
    selectedRole: PropTypes.string.isRequired,
    handleRoleFilterChange: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedFaculty: PropTypes.string.isRequired,
    handleFacultyFilterChange: PropTypes.func.isRequired,
    faculties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilterBar;
