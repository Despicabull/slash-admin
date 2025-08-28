import type { RouteObject } from "react-router";
import { Component } from "./utils";

export function getFrontendDashboardRoutes(): RouteObject[] {
	const frontendDashboardRoutes: RouteObject[] = [
		{ path: "dashboard", element: Component("/pages/dashboard/workbench") },
		{ path: "live-view", element: Component("/pages/dashboard/live_view") },
		{ path: "recordings", element: Component("/pages/dashboard/recordings") },
		{ path: "permissions", element: Component("/pages/management/permissions") },
		{ path: "roles", element: Component("/pages/management/roles") },
		{ path: "users", element: Component("/pages/management/users") },
		{ 
			path: "devices", 
			element: Component("/pages/management/devices"),
			children: [
				{ path: ":id", element: Component("/pages/management/devices/detail") }
			]
		},
		{ 
			path: "sites", 
			element: Component("/pages/management/sites"),
			children: [
				{ path: ":id", element: Component("/pages/management/sites/detail") }
			]
		},
		{ 
			path: "groups", 
			element: Component("/pages/management/groups"),
			children: [
				{ path: ":id", element: Component("/pages/management/groups/detail") }
			]
		},
	];
	return frontendDashboardRoutes;
}
