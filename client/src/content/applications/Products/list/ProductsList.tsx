import { Card, Grid } from '@mui/material';
import { CryptoOrder } from 'src/models/crypto_order';
import { subDays } from 'date-fns';
import { useGetOrdersQuery } from 'src/store/features/orders/ordersApi';
import { useGetProductsQuery } from 'src/store/features/products/productsApi';
import ProductCard from './ProductCard';

function ProductsList() {


  const {data:products,isLoading,isError} = useGetProductsQuery({},{
    // pollingInterval:5000
  });
  

  if(isLoading){
    return <p>Loading</p>
  }

  console.log(products);

  
  return (
     <Grid container spacing={2}  justifyContent="center" 
     alignItems="center"> 
      {products.map((product, index) => (
        <Grid item xs={12} sm={6} md={3} margin={'10px 5px'} key={index}>
          <ProductCard data={product} />
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductsList;
