import React from 'react';
import {Box, Grid} from '@mui/material';
import Header from './pages/Header.tsx';
import ImageFeatures from './pages/ImageFeatures/ImageFeatures.tsx';

const App: React.FC = () => {
    return (<Box>
            <Header/>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box style={{padding: '20px', height: '100%'}}>
                        <ImageFeatures/>
                    </Box>
                </Grid>
            </Grid>
        </Box>);
};

export default App;
