import { useUserRole, useUserPermissions, useUserToken } from "@/store/userStore";

/**
 * permission/role check hook
 * @param baseOn - check type: 'role' or 'permission'
 *
 * @example
 * // permission check
 * const { check, checkAny, checkAll } = useAuthCheck('permission');
 * check('user.create')
 * checkAny(['user.create', 'user.edit'])
 * checkAll(['user.create', 'user.edit'])
 *
 * @example
 * // role check
 * const { check, checkAny, checkAll } = useAuthCheck('role');
 * check('admin')
 * checkAny(['admin', 'editor'])
 * checkAll(['admin', 'editor'])
 */
export const useAuthCheck = (baseOn: "role" | "permission" = "permission") => {
	const { accessToken } = useUserToken();
	const role = useUserRole(); // assuming: Role (e.g., { code: string, ... })
	const permissions = useUserPermissions(); // assuming: Permission[] (e.g., [{ code: string }, ...])

	const check = (item: string): boolean => {
		if (!accessToken) return false;

		if (baseOn === "role") {
			return role?.code === item;
		}

		// Here TypeScript knows permissions is a Permission[]
		return permissions.some((p) => p.code === item);
	};

	const checkAny = (items: string[]): boolean => {
		if (items.length === 0) return true;
		return items.some((item) => check(item));
	};

	const checkAll = (items: string[]): boolean => {
		if (items.length === 0) return true;
		return items.every((item) => check(item));
	};

	return { check, checkAny, checkAll };
};
