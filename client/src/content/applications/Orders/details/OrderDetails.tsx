import { Helmet } from 'react-helmet-async';
import PageHeader from '../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import { useParams } from 'react-router';
import { useGetOrderQuery } from 'src/store/features/orders/ordersApi';
import OrderDetailsPage from './OrderDetailsPage';


function OrderDetails() {

    let { orderId } = useParams();
    console.log('orderId',orderId)


    const {data,isLoading,isError} = useGetOrderQuery(orderId,{
        // pollingInterval:5000
      });
      
    
      if(isLoading){
        return <p>Loading</p>
      }
    
      console.log("data",data);

  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
          <OrderDetailsPage/>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default OrderDetails;
