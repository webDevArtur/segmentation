import React from "react";

type ImageDataObject = {
    [key: number]: string;
};

export const uploadImageAndGetFeatures = (image: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>, selectedOption: string, setOriginalMask: React.Dispatch<React.SetStateAction<string | null>>, setImagesData: React.Dispatch<React.SetStateAction<ImageDataObject | null>>, applyMask: (image: string | null, selectedOption: string, setMaskUrl: React.Dispatch<React.SetStateAction<string | null>>, setMaskedImage: React.Dispatch<React.SetStateAction<string | null>>, setOriginalMask: React.Dispatch<React.SetStateAction<string | null>>) => void, setMaskUrl: React.Dispatch<React.SetStateAction<string | null>>, setMaskedImage: React.Dispatch<React.SetStateAction<string | null>>): void => {
    setLoading(true);

    fetch(image)
        .then((response) => response.blob())
        .then((blob) => {
            const formData = new FormData();
            formData.append('image', blob, 'image.jpg');

            fetch('https://by-alot.me/get_features_mask', {
                method: 'POST', body: formData, headers: {
                    'Accept': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    const decodedData = `data:image/png;base64,${data.predictions[0].segmentation_mask}`;
                    setOriginalMask(decodedData);
                    setImagesData(data.predictions[0].class_map);
                    applyMask(decodedData, selectedOption, setMaskUrl, setMaskedImage, setOriginalMask);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error parsing response:', error);
                    setLoading(false);
                });
        })
        .catch((error) => {
            console.error('Error converting image to Blob:', error);
            setLoading(false);
        });
};
