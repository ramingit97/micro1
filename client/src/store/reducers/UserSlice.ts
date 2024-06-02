import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "src/models/IUser";

const initialState = {
    user:null
}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        logout: () => initialState,
        setUser: (state, action: PayloadAction<IUser>) => {
          state.user = action.payload;
        },
    }
})

export default userSlice.reducer;
export const { logout, setUser } = userSlice.actions;