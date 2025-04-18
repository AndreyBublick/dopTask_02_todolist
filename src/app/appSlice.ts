import { createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit/react';
import { AppStatus } from 'common/enums';
import { todolistsApi } from '../features/todolists/api/todolistsApi';
import { tasksApi } from '../features/todolists/api/tasksApi';

const initialState = {
  themeMode: 'light' as ThemeModeType,
  error: null as null | string,
  status: 'idle' as AppStatus,
  captcha: null as null | string,

  isAuth: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  selectors: {
    selectModeTheme: state => state.themeMode,
    selectAppStatus: state => state.status,
    selectAppError: state => state.error,
    selectIsAuth: state => state.isAuth,
    selectCaptcha: state => state.captcha,
  },
  reducers: create => ({
    changeThemeMode: create.reducer<{ themeMode: ThemeModeType }>((state, action) => {
      state.themeMode = action.payload.themeMode;
    }),
    changeAppStatus: create.reducer<{ status: AppStatus }>((state, action) => {
      state.status = action.payload.status;
    }),

    setAppError: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error;
    }),
    changeIsAuth: create.reducer<{ isAuth: boolean }>((state, action) => {
      state.isAuth = action.payload.isAuth;
    }),
    setCaptcha: create.reducer<{ captcha: string | null }>((state, action) => {
      state.captcha = action.payload.captcha;
    }),
  }),
  extraReducers: builder => {
    builder
      .addMatcher(isPending, (state, action) => {
        if (
          todolistsApi.endpoints.getTodolists.matchPending(action) ||
          tasksApi.endpoints.getTasks.matchPending(action)
        ) {
          return;
        }
        state.status = AppStatus.loading;
      })
      .addMatcher(isFulfilled, state => {
        state.status = AppStatus.succeeded;
      })
      .addMatcher(isRejected, state => {
        state.status = AppStatus.failed;
      });
  },
});

export const appReducer = appSlice.reducer;
export const { selectModeTheme, selectAppError, selectIsAuth, selectAppStatus, selectCaptcha } = appSlice.selectors;
export const { changeThemeMode, setAppError, changeIsAuth, setCaptcha } = appSlice.actions;

export type ThemeModeType = 'light' | 'dark';
