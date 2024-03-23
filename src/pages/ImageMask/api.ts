const fetchData = async (selectedImage: string) => {
    const blob = await fetch(selectedImage).then(response => response.blob());
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');
    const response = await fetch('https://by-alot.me/get_full_mask', {
        method: 'POST', body: formData,
    });
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return await response.json();
};

export default fetchData;
