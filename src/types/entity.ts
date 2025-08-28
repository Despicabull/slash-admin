import type { NavItemDataProps } from "@/components/nav/types";
import type { BasicStatus, GroupType, PermissionType } from "./enum";

export interface UserToken {
	accessToken?: string;
	refreshToken?: string;
}

export interface UserInfo {
	id: string;
	email: string;
	username: string;
	password?: string;
	avatar?: string;
	role: Role;
	status?: BasicStatus;
	menu?: MenuTree[];
}

export interface Permission_Old {
	id: string;
	parentId: string;
	name: string;
	label: string;
	type: PermissionType;
	route: string;
	status?: BasicStatus;
	order?: number;
	icon?: string;
	component?: string;
	hide?: boolean;
	hideTab?: boolean;
	frameSrc?: URL;
	newFeature?: boolean;
	children?: Permission_Old[];
}

export interface Role_Old {
	id: string;
	name: string;
	code: string;
	status: BasicStatus;
	order?: number;
	desc?: string;
	permission?: Permission_Old[];
}

export interface CommonOptions {
	status?: BasicStatus;
	desc?: string;
	createdAt?: string;
	updatedAt?: string;
}
export interface User extends CommonOptions {
	id: string;
	username: string;
	password: string;
	email: string;
	role: Role;
	phone?: string;
	avatar?: string;
}

export interface Role extends CommonOptions {
	id: string;
	name: string;
	code: string;
	permissions?: Permission[];
}

export interface Permission extends CommonOptions {
	id: string;
	name: string;
	code: string;
}

export interface Group extends CommonOptions {
	id: string;
	name: string;
	type: GroupType;
	devices?: Device[];
}

export interface Site extends CommonOptions {
	id: string;
	name: string;
	address?: string;
	devices?: Device[];
}

export interface Recording extends CommonOptions {
	id: string;
	deviceName: string;
	startTime: string;
	endTime: string;
	duration: number;
	videoSrc: string;
	fileSize?: number;
}

export interface Device extends CommonOptions {
	id: string;
	name: string;
	version: string;
	hostname: string;
	macs: string[];
	ips: string[];
	uptime: string;
	totalMemory: string;
	usedMemory: string;
	onvif: string;
	lastHeartbeat: string;
	streamUrl?: string;
}

export interface Menu extends CommonOptions, MenuMetaInfo {
	id: string;
	parentId: string;
	name: string;
	code: string;
	order?: number;
	type: PermissionType;
}

export type MenuMetaInfo = Partial<
	Pick<NavItemDataProps, "path" | "icon" | "caption" | "info" | "disabled" | "auth" | "hidden">
> & {
	externalLink?: URL;
	component?: string;
};

export type MenuTree = Menu & {
	children?: MenuTree[];
};
