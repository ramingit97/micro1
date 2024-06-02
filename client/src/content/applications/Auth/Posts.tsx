import { useGetUsersQuery } from "src/store/features/UserApi";

function Posts() {

  const {data:users} = useGetUsersQuery(5);
  console.log(users);
  return (
    <>
     {users && users.map(user=>{
        <p>{user.email}</p>
     })}
     
    </>
  );
}




export default Posts;
