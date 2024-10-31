import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const Circle = ({ size, color, position }) => {
    return (
        <Box
            sx={{
                position: 'absolute',
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: '50%',
                ...position,
            }}
        />
    );
};

Circle.propTypes = {
    size: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
}

export default Circle;
