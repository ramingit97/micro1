import { FC, useState, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/styles';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCreateProductMutation } from 'src/store/features/products/productsApi';

interface ProductFormProps {
  className?: string;
}

const AddProduct: FC<ProductFormProps> = () => {
  const [productName, setProductName] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [createProduct] = useCreateProductMutation();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setProductName(event.target.value);
  };

  const handleDescriptionChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setProductDescription(event.target.value);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleImageRemove = (index: number): void => {
    const newImages = images.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newImagePreviews);
  };

  const handleUpload = async () => {
    const data = {
      name: productName,
      description: productDescription,
      files: images
    };
    console.log('daa',data);
    
    await createProduct(data);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="div">
          Add New Product
        </Typography>
        <Box mt={3}>
          <TextField
            fullWidth
            label="Product Name"
            value={productName}
            onChange={handleNameChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Product Description"
            value={productDescription}
            onChange={handleDescriptionChange}
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
          />
          <Box mt={2}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-photo"
              type="file"
              multiple
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-photo">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<PhotoCamera />}
              >
                Upload Photos
              </Button>
            </label>
          </Box>
          <Grid container spacing={2} mt={2}>
            {imagePreviews.map((src, index) => (
              <Grid item xs={3} key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden',
                    '&:hover .overlay': {
                      opacity: 1,
                    },
                  }}
                >
                  <img src={src} alt={`Preview ${index}`} width="100%" />
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    <IconButton
                      onClick={() => handleImageRemove(index)}
                      sx={{ color: 'white' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" color="primary" onClick={handleUpload} disabled={!images.length}>
        Upload
      </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

AddProduct.propTypes = {
  className: PropTypes.string,
};

export default AddProduct;