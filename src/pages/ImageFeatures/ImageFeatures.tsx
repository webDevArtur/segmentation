import React, {useEffect, useState} from 'react';
import {ThemeProvider, useTheme} from '@mui/material/styles';
import {Alert, Box, Button, CircularProgress, Grid, Paper} from '@mui/material';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from '@mui/icons-material/Delete';
import ImageMask from "../ImageMask/ImageMask.tsx";
import {uploadImageAndGetFeatures} from './api';
import {applyMask, applyMaskToImage} from './imageFeaturesUtils.ts';
import ImageUpload from '../ImageUpload/ImageUpload.tsx';

type ImageData = {
    [key: number]: string;
};

const ImageFeatures: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [imagesData, setImagesData] = useState<ImageData | null>(null);
    const [originalMask, setOriginalMask] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('-1');
    const [maskUrl, setMaskUrl] = useState<string | null>(null);
    const [maskedImage, setMaskedImage] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState<boolean>(false);

    const theme = useTheme();

    const handleUpload = () => {
        if (image) {
            uploadImageAndGetFeatures(image, setLoading, selectedOption, setOriginalMask, setImagesData, applyMask, setMaskUrl, setMaskedImage);
        }
    };

    const handleDeleteImage = () => {
        setImage(null);
        setMaskedImage(null);
        setMaskUrl(null);
        setSelectedOption('-1');
        setOriginalMask(null);
        setImagesData(null);
    };

    const handleOptionClick = (option: string) => {
        if (option !== selectedOption) {
            setSelectedOption(option);
            applyMask(originalMask, option, setMaskUrl, setMaskedImage);
        }
    };

    useEffect(() => {
        if (maskUrl && image) {
            applyMaskToImage(image, maskUrl, setImageLoading, setMaskedImage);
        }
    }, [maskUrl, image]);

    const handleShowImageResults = () => {
        setSelectedOption('-1');
    };

    return (<ThemeProvider theme={theme}>
            {!image && <ImageUpload setImage={setImage}/>}
            {image && (<Paper elevation={3} style={{padding: theme.spacing(3), marginTop: theme.spacing(3)}}>
                    <Box sx={{
                        width: '100%',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <TransformWrapper>
                            <TransformComponent>
                                <img src={image} alt="uploaded" style={{maxWidth: '100%', height: 'auto'}}/>
                            </TransformComponent>
                        </TransformWrapper>
                        <Box sx={{
                            width: '100%',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: theme.spacing(2)
                        }}>
                            <Button
                                startIcon={<DeleteIcon/>}
                                onClick={handleDeleteImage}
                                variant="contained"
                                color="error"
                                sx={{width: '100%', marginBottom: theme.spacing(1)}}
                            >
                                Удалить
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<CloudUploadIcon/>}
                                onClick={handleUpload}
                                disabled={loading}
                                sx={{width: '100%'}}
                            >
                                {loading ? <CircularProgress size={24}/> : 'Отправить изображение'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>)}
            {image && imagesData && (<>
                    <Paper elevation={3} style={{padding: theme.spacing(3), marginTop: theme.spacing(3)}}>
                        <Box sx={{
                            display: 'flex',
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}>
                            {imageLoading && selectedOption !== '-1' && <CircularProgress sx={{marginTop: '10px'}}/>}
                            {maskedImage && selectedOption !== '-1' && (<Box sx={{marginTop: '10px'}}>
                                    <TransformWrapper>
                                        <TransformComponent>
                                            <img src={maskedImage} alt="maskedImage"
                                                 style={{maxWidth: '100%', height: 'auto'}}/>
                                        </TransformComponent>
                                    </TransformWrapper>
                                </Box>)}
                            {selectedOption === '-1' && (<ImageMask selectedImage={image}/>)}
                            {!maskedImage && selectedOption !== '-1' && !imageLoading && (
                                <Alert severity="info" sx={{marginTop: '30px'}}>Данного узора нет</Alert>)}
                            {imagesData && (<>
                                    <Grid container spacing={2}
                                          sx={{marginTop: theme.spacing(2), justifyContent: 'center'}}>
                                        {Object.entries(imagesData).slice(1).map(([key, value], index) => (
                                            <Grid item key={key} sx={{
                                                textAlign: 'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {index === 0 && (<Button
                                                        onClick={handleShowImageResults}
                                                        variant={selectedOption === '-1' ? 'contained' : 'outlined'}
                                                        color="primary"
                                                        sx={{marginRight: theme.spacing(2)}}
                                                    >
                                                        Mask
                                                    </Button>)}
                                                <Button
                                                    variant={selectedOption === key ? 'contained' : 'outlined'}
                                                    color="primary"
                                                    onClick={() => handleOptionClick(key)}
                                                >
                                                    {String(value)}
                                                </Button>
                                            </Grid>))}
                                    </Grid>
                                </>)}
                        </Box>
                    </Paper>
                </>)}
        </ThemeProvider>);
};

export default ImageFeatures;
