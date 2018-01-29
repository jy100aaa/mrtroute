import React from 'react';
import TableCell from './TableCell';
import { Link } from 'react-router';

const NotFound = () => {
    return (
        <TableCell
            style={{
                width: '100%',
                height: '100%',
                textAlign: 'center'
            }}
            data={
                <div>
                    Page's Not Found
                    <br />
                    <br />
                    :-(
                    <br />
                    <br />
                    <Link
                        to="/"
                        className="btn"
                        style={{
                            display: 'inline-block',
                            color: '#fff'
                        }}
                    >
                        Go Back to Home
                    </Link>
                </div>
            }
        />
    );
};

export default NotFound;
