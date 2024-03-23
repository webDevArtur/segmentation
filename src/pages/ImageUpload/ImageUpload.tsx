import React, {useState} from 'react';
import {Paper, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import Dropzone from 'react-dropzone';
import ImageIcon from '@mui/icons-material/Image';
import ImageIconHover from '@mui/icons-material/AddPhotoAlternate';

type Props = {
    setImage: React.Dispatch<React.SetStateAction<string | null>>;
};

const ImageUpload: React.FC<Props> = ({setImage}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const theme = useTheme();

    const dropZoneStyle: React.CSSProperties = {
        width: '100%',
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px dashed #aaa',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: theme.spacing(2),
    };

    const handleDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const items = event.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                        setImage(URL.createObjectURL(file));
                    }
                }
            }
        }
    };

    return (<Paper elevation={3} style={{padding: theme.spacing(3)}}>
            <Dropzone onDrop={handleDrop}>
                {({getRootProps, getInputProps}) => (<div
                        {...getRootProps()}
                        style={dropZoneStyle}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onPaste={handlePaste}
                    >
                        <input {...getInputProps()} />
                        {isHovered ? (
                            <ImageIconHover sx={{fontSize: 48, color: '#ccc', marginBottom: theme.spacing(1)}}/>) : (
                            <ImageIcon sx={{fontSize: 48, color: '#ccc', marginBottom: theme.spacing(1)}}/>)}
                        <Typography variant="h6" component="span" sx={{fontWeight: 'bold'}}>
                            Перетащите изображение сюда, нажмите <span
                            style={{fontWeight: 'bold', color: '#1976d2'}}>Ctrl+V</span> или <span
                            style={{fontStyle: 'italic', color: '#4caf50'}}>Выбрать</span>
                        </Typography>
                    </div>)}
            </Dropzone>
        </Paper>);
};

export default ImageUpload;
