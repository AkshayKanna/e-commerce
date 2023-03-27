import React, { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { ThemeProvider, createMuiTheme } from '@mui/material/styles';

const snackBarTheme = createMuiTheme({
    overrides: {
        MuiSnackbarContent: {
            root: {
                fontSize: '0.875rem',
            },
        },
    },
});

export default function GlobalError({ error, open, onclose }) {
    const [backgroundColor, setBackgroundColor] = React.useState('#cc0000');
    const [internalOpen, setInternalOpen] = React.useState(false);
    const [internalError, setInternalError] = React.useState(null);
    useEffect(() => {
        if (open === true) {
            setInternalOpen(true);
        }
    }, [open]);

    useEffect(() => {
        if (error) {
            setInternalError(error);
            if (error && error.toLowerCase().includes('success')) {
                setBackgroundColor('#0080a2');
            } else {
                setBackgroundColor('#cc0000');
            }
        }
    }, [error]);

    return (
        <ThemeProvider theme={snackBarTheme}>
            <Snackbar
                style={{
                    paddingBottom: 20,
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={internalOpen}
                autoHideDuration={3000}
                onClose={() => {
                    setInternalOpen(false);
                    setInternalError(null);
                    if (onclose) onclose();
                }}
            >
                <SnackbarContent
                    style={{
                        backgroundColor,
                    }}
                    message={internalError || ''}
                />
            </Snackbar>
        </ThemeProvider>
    );
}
