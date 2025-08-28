import apiClient from "../apiClient";
import type { User } from "#/entity";
import type { UserInfo, UserToken } from "#/entity";

export interface SignInReq {
	username: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
	SignIn = "/auth/signin",
	SignUp = "/auth/signup",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	Users = "/users",
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });
const fetchUsers = () => apiClient.get<User[]>({ url: UserApi.Users });
const fetchByUserId = (id: string) => apiClient.get<User>({ url: `${UserApi.Users}/${id}` });

export default {
	signin,
	signup,
	logout,
	fetchUsers,
	fetchByUserId,
};
