import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Prediction {
    predicted_classes: string[];
    predictions: {
        [className: string]: {
            confidence: number;
        };
    };
}

interface ClassificationComponentProps {
    selectedImage: string;
}

const ClassificationComponent: React.FC<ClassificationComponentProps> = ({ selectedImage }) => {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                setLoading(true);
                setError(null);

                const imageResponse = await fetch(selectedImage);
                const blob = await imageResponse.blob();

                const formData = new FormData();
                formData.append('image', blob, 'image.jpg');

                const apiUrl = 'https://by-alot.me/get_classify';
                const predictionsResponse = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!predictionsResponse.ok) {
                    throw new Error('Failed to get predictions');
                }

                const data: { predictions: Prediction[] } = await predictionsResponse.json();
                setPredictions(data.predictions);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedImage) {
            fetchPredictions();
        }
    }, [selectedImage]);

    if (!selectedImage) {
        return <Typography>No image selected</Typography>;
    }

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center"><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    if (predictions.length === 0) {
        return <Typography>No predictions found</Typography>;
    }

    return (
        <TableContainer component={Paper} sx={{mb: 2}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                bgcolor: 'primary.main',
                            }}
                        >
                            Class
                        </TableCell>
                        <TableCell
                            align="right"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                bgcolor: 'primary.main',
                            }}
                        >
                            Confidence
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {predictions.map((prediction, index) => (
                        Object.keys(prediction.predictions)
                            .sort((a, b) => prediction.predictions[b].confidence - prediction.predictions[a].confidence)
                            .map((className, i) => (
                                <TableRow
                                    key={`${index}-${i}`}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{ fontWeight: i === 0 ? 'bold' : 'normal'}}
                                    >
                                        {className}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ fontWeight: i === 0 ? 'bold' : 'normal'}}
                                    >
                                        {prediction.predictions[className].confidence.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClassificationComponent;
