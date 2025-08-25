import type { RouteObject } from "react-router";
import { Component } from "./utils";

export function getFrontendDashboardRoutes(): RouteObject[] {
	const frontendDashboardRoutes: RouteObject[] = [
		{ path: "dashboard", element: Component("/pages/dashboard/workbench") },
		{ path: "live-view", element: Component("/pages/dashboard/live_view") },
		{ path: "recordings", element: Component("/pages/dashboard/recordings") },
		{ path: "roles", element: Component("/pages/management/roles") },
		{ path: "users", element: Component("/pages/management/users") },
		{ path: "devices", element: Component("/pages/management/devices") },
		{ path: "sites", element: Component("/pages/management/sites") },
		{ path: "groups", element: Component("/pages/management/groups") },
	];
	return frontendDashboardRoutes;
}
