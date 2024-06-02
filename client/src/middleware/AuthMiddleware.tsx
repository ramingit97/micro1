import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
import LinearIndeterminate from "src/components/Loader/LinearIndeterminate";
import { userApi } from "src/store/features/UserApi";

type IAuthMiddleware = {
    children: React.ReactElement;
  };

const AuthMiddleware: React.FC<IAuthMiddleware> = ({ children }) => {
    let token = localStorage.getItem('token')
    const { isLoading, isFetching } = userApi.endpoints.getMe.useQuery(null, {
      skip: !token,
      refetchOnMountOrArgChange: true,
    });

    
  
    const loading = isLoading || isFetching;
  
    const user = userApi.endpoints.getMe.useQueryState(null, {
      selectFromResult: ({ data }) => data,
    });

    const navigate = useNavigate();
    useEffect(()=>{
      if(!loading && !user){
        navigate("/auth/signin")
      }
    },[user,loading])
  
  
    if (loading) {
      return <LinearIndeterminate/>;
    }

    return children
  };
  
  export default AuthMiddleware;