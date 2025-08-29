import type { Role, User, UserInfo, UserToken } from "#/entity";
import apiClient from "../apiClient";

export interface SignInReq {
	username: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
}

export interface CreateUserReq {
	username: string;
	email: string;
	password: string;
	role: Role;
}

export interface UpdateUserReq {
	username?: string;
	email?: string;
	role?: Role;
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
const createUser = (data: CreateUserReq) => apiClient.post<User>({ url: UserApi.Users, data });
const updateUser = (id: string, data: UpdateUserReq) => apiClient.patch<User>({ url: `${UserApi.Users}/${id}`, data });
const deleteUser = (id: string) => apiClient.delete({ url: `${UserApi.Users}/${id}` });
const fetchUsers = () => apiClient.get<User[]>({ url: UserApi.Users });
const fetchByUserId = (id: string) => apiClient.get<User>({ url: `${UserApi.Users}/${id}` });

export default {
	signin,
	signup,
	logout,
	createUser,
	updateUser,
	deleteUser,
	fetchUsers,
	fetchByUserId,
};
