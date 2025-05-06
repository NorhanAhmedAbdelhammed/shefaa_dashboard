import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from '@services/auth.service';
import profileServices from '@services/profile.services';
import { ERole } from '@servicesTypes/auth.types';
import { IAdmin } from '@servicesTypes/profile.types';

export const getAdminProfileThunk = createAsyncThunk('admin/profile', async (_, thunkAPI) => {
  const data = await profileServices.get();
  return data;
});

const initialState: IAdmin = {
  id: 0,
  username: '',
  email: '',
  role: ERole.SUBADMIN,
  profilePicturePath: undefined,
  profilePictureLink: undefined,
  createdAt: '',
};

const authSlice = createSlice({
  initialState,
  name: 'auth',

  reducers: {
    // empty all auth related data and clear the localstorage
    logout(state) {
      authService.logout(); // this is enough to clear the store --> reload window
      return initialState; // systematic cleaning
    },
  },
  extraReducers(builder) {
    builder.addCase(getAdminProfileThunk.fulfilled, (state, action) => {
      return action.payload.admin;
    });
  },
});

// selectors
export const selectAuth = (state: RootState) => state.auth as IAdmin;

// actions
export const { logout: logoutAction } = authSlice.actions;

export default authSlice.reducer;
