import React from 'react';
import PropTypes from 'prop-types';

const TableCell = (props) => {
    return (
        <table
            style={props.style}
        >
            <tbody>
            <tr>
                <td>
                    { props.data }
                </td>
            </tr>
            </tbody>
        </table>
    );
};

TableCell.propTypes = {
    data: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    style: PropTypes.object
};

TableCell.defaultProps = {
    data: '',
    style: {}
};

export default TableCell;
