import {
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_RESET,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT,
  AUTH_REGISTER_FAILURE,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_RESET,
  AUTH_REGISTER_SUCCESS,
} from "./actionTypes";

// Define TypeScript interfaces
interface UserState {
  loading: boolean;
  error: boolean;
  message: string;
}

interface UserLogoutState {
  message: string;
}

interface AuthDataState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
}

interface AuthState {
  userLogin: UserState;
  userRegister: UserState;
  userLogout: UserLogoutState;
  data: AuthDataState;
}

interface ActionType {
  type: string;
  payload?: any;
}

const TOKEN = localStorage.getItem("token");
const initialState: AuthState = {
  userLogin: { loading: false, error: false, message: "" },
  userRegister: { loading: false, error: false, message: "" },
  userLogout: { message: "" },
  data: {
    isAuthenticated: !!TOKEN,
    token: TOKEN,
    user: null,
  },
};

export default function authReducer(state = initialState, { type, payload }: ActionType): AuthState {
  switch (type) {
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        userLogin: { loading: true, error: false, message: "" },
      };
    case AUTH_LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        userLogin: { loading: false, error: false, message: payload.message },
        data: {
          isAuthenticated: true,
          token: payload.token,
          user: payload.user,
        },
      };
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        userLogin: { loading: false, error: true, message: payload.message },
      };

    case AUTH_LOGIN_RESET:
      return {
        ...state,
        userLogin: { loading: false, error: false, message: "" },
      };
    case AUTH_LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        userLogout: { message: "Logout Successfully" },
        data: {
          isAuthenticated: false,
          token: null,
          user: null,
        },
      };

    case AUTH_REGISTER_REQUEST:
      return {
        ...state,
        userRegister: { loading: true, error: false, message: "" },
      };
    case AUTH_REGISTER_SUCCESS:
      return {
        ...state,
        userRegister: {
          loading: false,
          error: false,
          message: payload.message,
        },
      };
    case AUTH_REGISTER_FAILURE:
      return {
        ...state,
        userRegister: { loading: false, error: true, message: payload.message },
      };

    case AUTH_REGISTER_RESET:
      return {
        ...state,
        userRegister: { loading: false, error: false, message: "" },
      };

    default:
      return state;
  }
}
