import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import PropTypes from 'prop-types';
const TopicsTable = ({ topics }) => {
    return (
        <TableContainer component={Paper} style={{ marginTop: '1em' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Topic Name</TableCell>
                        <TableCell>Faculty</TableCell>
                        <TableCell>Release Date</TableCell>
                        <TableCell>End Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {topics.length > 0 ? (
                        topics.map(topic => (
                            <TableRow key={topic._id}>
                                <TableCell>{topic.topicName}</TableCell>
                                <TableCell>{topic.faculty?.facultyName}</TableCell>
                                <TableCell>{new Date(topic.releaseDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(topic.endDate).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">No topics created in this faculty.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

TopicsTable.propTypes = {
    topics: PropTypes.array.isRequired,
}

export default TopicsTable;