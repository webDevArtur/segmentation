import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {predictions.map((prediction, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Typography variant="h4" fontWeight="bold">{prediction.predicted_classes[0]}</Typography>
                        <Typography variant="body1">Точность: {prediction.predictions[prediction.predicted_classes[0]].confidence.toFixed(2)}</Typography>
                    </div>
                ))}
        </div>
    );
};

export default ClassificationComponent;
