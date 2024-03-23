import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header: React.FC = () => {
    return (<AppBar position="static" style={{height: '64px'}}>
            <Toolbar>
                <Typography variant="h6" component="div" style={{flexGrow: 1, fontWeight: 'bold'}}>
                    Melanoma.NET
                </Typography>
            </Toolbar>
        </AppBar>);
}

export default Header;
