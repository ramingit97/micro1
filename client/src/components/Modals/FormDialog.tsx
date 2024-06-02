import { Box, Container, Card, Stack, Typography, Link, Tabs, Tab, TextField, FormHelperText, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';


function AddOrder2() {
  const formik = useFormik({
    initialValues: {
      title: 'Title',
      description: 'Description',
    },
    validationSchema: Yup.object({
    title: Yup
        .string()
        .required('title is required'),
    description: Yup
        .string()
        .min(10)
        .required('Description is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
            console.log(values);
        
      } catch (err) {
        console.log('erer',err)
      }
    }
  });

  
 

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 2,
            py: '20px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              
            </Stack>
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.title && formik.errors.title)}
                    fullWidth
                    helperText={formik.touched.title && formik.errors.title}
                    label="Title"
                    name="title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="title"
                    value={formik.values.title}
                  />

                <TextField
                    error={!!(formik.touched.description && formik.errors.description)}
                    fullWidth
                    helperText={formik.touched.description && formik.errors.description}
                    label="Description"
                    name="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="description"
                    value={formik.values.description}
                  />
                </Stack>
              </form>
          </div>
        </Box>
      </Box>
    </>
  )
}




export default AddOrder2;
