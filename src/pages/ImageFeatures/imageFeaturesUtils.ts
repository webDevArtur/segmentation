import React from 'react';

export const applyMask = (image: string | null, selectedOption: string, setMaskUrl: React.Dispatch<React.SetStateAction<string | null>>, setMaskedImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (!image) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let allBlack = true;

        for (let i = 0; i < data.length; i += 4) {
            const brightness = data[i];
            const isOptionSelected = parseInt(selectedOption) === brightness;
            data[i + 3] = isOptionSelected ? 0 : 157;
            if (data[i + 3] !== 157) {
                allBlack = false;
            }
        }

        ctx.putImageData(imageData, 0, 0);

        if (allBlack) {
            setMaskUrl(null);
            setMaskedImage(null);
        } else {
            const maskedImageURL = canvas.toDataURL();
            setMaskUrl(maskedImageURL);
        }
    };
    img.src = image!;
};


export const applyMaskToImage = (image: string | null, maskUrl: string, setImageLoading: React.Dispatch<React.SetStateAction<boolean>>, setMaskedImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    setImageLoading(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        const maskImg = new Image();
        maskImg.crossOrigin = 'anonymous';
        maskImg.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);
            ctx.globalCompositeOperation = 'source-atop';
            ctx.drawImage(maskImg, 0, 0, canvas.width, canvas.height);
            setImageLoading(false);
            setMaskedImage(canvas.toDataURL());
        };
        maskImg.src = maskUrl;
    };
    img.src = image!;
};