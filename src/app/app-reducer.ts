import { Dispatch } from 'redux';
import { authAPI } from '../api/todolists-api';
import { setIsLoggedInAC } from '../features/Login/auth-reducer';
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils';

const initialState: InitialStateType = {
  status: 'idle',
  error: null,
  initialized: false,
};

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return { ...state, status: action.status };
    case 'APP/SET-ERROR':
      return { ...state, error: action.error };
    case 'APP/IS-INITIALIZED':
      return { ...state, initialized: action.initialized };
    default:
      return { ...state };
  }
};

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsInitializedAC(true));
        dispatch(setIsLoggedInAC(true));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType;
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null;
  initialized: boolean;
};

export const setAppErrorAC = (error: string | null) => ({ type: 'APP/SET-ERROR', error } as const);
export const setAppStatusAC = (status: RequestStatusType) => ({ type: 'APP/SET-STATUS', status } as const);

export const setIsInitializedAC = (initialized: boolean) => ({ type: 'APP/IS-INITIALIZED', initialized } as const);

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
export type setIsInitializedActionType = ReturnType<typeof setIsInitializedAC>;

type ActionsType = SetAppErrorActionType | SetAppStatusActionType | setIsInitializedActionType;
