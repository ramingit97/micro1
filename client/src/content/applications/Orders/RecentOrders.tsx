import { Card } from '@mui/material';
import { CryptoOrder } from 'src/models/crypto_order';
import RecentOrdersTable from './RecentOrdersTable';
import { subDays } from 'date-fns';
import { useGetOrdersQuery } from 'src/store/features/orders/ordersApi';

function RecentOrders() {


  const {data,isLoading,isError} = useGetOrdersQuery({},{
    // pollingInterval:5000
  });
  

  if(isLoading){
    return <p>Loading</p>
  }

  console.log(data);

  
  return (
    <Card>
       <RecentOrdersTable cryptoOrders={data} />
    </Card>
  );
}

export default RecentOrders;
