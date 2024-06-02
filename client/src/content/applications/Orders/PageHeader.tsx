import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import FormDialog from 'src/components/Modals';
import AddOrder from './AddOrder';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateOrderMutation } from 'src/store/features/orders/ordersApi';

function PageHeader() {



  const [createOrder,{isLoading,isSuccess,error,isError}] = useCreateOrderMutation();


  const formik = useFormik({
    initialValues: {
      number: '0',
    },
    validationSchema: Yup.object({
      number: Yup
        .string()
        .required('number is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
          createOrder(values);
      } catch (err) {
        console.log('erer',err)
      }
    }
  });


  const onSubmit = ()=>{
    console.log("submit")
  }
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Orders
        </Typography>
      </Grid>
      <Grid item>
          <FormDialog buttonTitle='Create Orders' onSubmit={onSubmit}
          formik={formik}
          >
            <AddOrder formik={formik}/>
          </FormDialog>

      </Grid>
    </Grid>
  );
}

export default PageHeader;
