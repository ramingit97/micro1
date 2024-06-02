import PropTypes from 'prop-types';
import { Box, Typography,Grid } from '@mui/material';
import { FC, ReactNode, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { userApi } from "src/store/features/UserApi";

// TODO: Change subtitle text
interface BaseLayoutProps {
    children?: ReactNode;
}


const AuthLayout:FC<BaseLayoutProps> = ({children}) => {
  let token = localStorage.getItem('token');
  const { isLoading, isFetching,data } = userApi.endpoints.getMe.useQuery(null, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const loading = isLoading || isFetching;
    
  const user = userApi.endpoints.getMe.useQueryState(null, {
    selectFromResult: ({ data }) => data,
  });

  const navigate = useNavigate();
  useEffect(()=>{
    if(!token || !data) return;
    if(!loading && user){
      navigate("/dashboards")
    }
  },[user,loading])


  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flex: '1 1 auto'
      }}
    >
      <Grid
        container
        sx={{ flex: '1 1 auto' }}
      >
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Box
            component="header"
            sx={{
              left: 0,
              p: 3,
              position: 'fixed',
              top: 0,
              width: '100%'
            }}
          >
          </Box>
          {children || <Outlet />}
        </Grid>
        <Grid
          xs={12}
          lg={6}
          sx={{
            alignItems: 'center',
            background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            '& img': {
              maxWidth: '100%'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: '24px',
                lineHeight: '32px',
                mb: 1
              }}
              variant="h1"
            >
              Welcome to{' '}
              <Box
                component="a"
                sx={{ color: '#15B79E' }}
                target="_blank"
              >
                Devias Kit
              </Box>
            </Typography>
            <Typography
              align="center"
              sx={{ mb: 3 }}
              variant="subtitle1"
            >
              A professional kit that comes with ready-to-use MUI components.
            </Typography>
            <img
              alt=""
              src="/assets/auth-illustration.svg"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthLayout;