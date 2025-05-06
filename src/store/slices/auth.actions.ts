import store from '../store';
import { logoutAction } from './auth.slice';

export const logout = () => store.dispatch(logoutAction());
