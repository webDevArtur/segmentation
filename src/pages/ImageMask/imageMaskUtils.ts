const applySegmentationMask = (maskData: string, width: number, height: number, setImageUrl: (url: string | null) => void, selectedImage: string) => {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width || 0;
        canvas.height = height || 0;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width || 0, height || 0);

        const maskImage = new Image();
        maskImage.onload = () => {
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = width || 0;
            maskCanvas.height = height || 0;
            const maskCtx = maskCanvas.getContext('2d');
            maskCtx?.drawImage(maskImage, 0, 0, width || 0, height || 0);

            const maskData = maskCtx?.getImageData(0, 0, width || 0, height || 0);
            const imageData = ctx?.getImageData(0, 0, width || 0, height || 0);

            if (maskData && imageData) {
                for (let i = 0; i < imageData.data.length; i += 4) {
                    if (maskData.data[i] === 0 && maskData.data[i + 1] === 0 && maskData.data[i + 2] === 0) {
                        imageData.data[i] *= 0.4;
                        imageData.data[i + 1] *= 0.4;
                        imageData.data[i + 2] *= 0.4;
                    }
                }
                ctx?.putImageData(imageData, 0, 0);
                setImageUrl(canvas.toDataURL());
            }
        };
        maskImage.src = `data:image/png;base64,${maskData}`;
    };
    img.src = selectedImage;
};

export default applySegmentationMask;
