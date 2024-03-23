import React, {useEffect, useState} from 'react';
import {Box, CircularProgress} from '@mui/material';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import fetchData from './api';
import applySegmentationMask from './imageMaskUtils.ts';

interface ImageResultsProps {
    selectedImage: string;
}

const ImageMask: React.FC<ImageResultsProps> = ({selectedImage}) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (selectedImage) {
            handleFetchData();
        }
    }, [selectedImage]);

    const handleFetchData = async () => {
        setLoading(true);
        try {
            const data = await fetchData(selectedImage);
            const {predictions, image: {width: imgWidth, height: imgHeight}} = data;
            applySegmentationMask(predictions[0].segmentation_mask, parseInt(imgWidth), parseInt(imgHeight), setImageUrl, selectedImage);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (<>
            {loading && <CircularProgress sx={{marginTop: '10px'}}/>}
            {imageUrl && !loading && (<Box sx={{marginTop: '10px'}}>
                    <TransformWrapper>
                        <TransformComponent>
                            <img
                                src={imageUrl}
                                alt="Uploaded"
                                style={{maxWidth: '100%', height: 'auto'}}
                            />
                        </TransformComponent>
                    </TransformWrapper>
                </Box>)}
        </>);
};

export default ImageMask;
