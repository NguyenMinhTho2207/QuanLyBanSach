import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: '',
  name: '',
  email: '',
  phone_number: '',
  address: '',
  avatar: '',
  access_token: ''
}

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      let { id, name = '', email = '', phone_number = '', address = '', avatar = '', access_token = '' } = action.payload
      state.id = id;
      state.name = name;
      state.email = email;
      state.phone_number = phone_number;
      state.address = address;
      state.avatar = avatar;
      state.access_token = access_token;
    },
    resetUser: (state) => {
      state.id = '';
      state.name = '';
      state.email = '';
      state.phone_number = '';
      state.address = '';
      state.avatar = '';
      state.access_token = '';
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer