import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "src/models/IUser";

const initialState = {
    result:[]
}

export const orderSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setOrders: (state, action: PayloadAction<IUser>) => {
          state.result.push(action.payload);
        },
    }
})

export default orderSlice.reducer;
export const {  setOrders } = orderSlice.actions;