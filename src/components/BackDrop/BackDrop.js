import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: 2000,
        color: '#fff',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        padding: 10,
    },
}));

const SimpleBackdrop = ({ open, value }) => {
    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={open ? open : false}>
            <Typography className={classes.text} variant="subtitle1">
                {value || 'Loading.... Please Wait'}
            </Typography>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default SimpleBackdrop;
