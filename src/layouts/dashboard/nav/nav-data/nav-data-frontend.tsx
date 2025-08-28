import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const frontendNavData: NavProps["data"] = [
	{
		name: "sys.nav.monitoring",
		items: [
			{
				title: "sys.nav.dashboard",
				path: "/dashboard",
				icon: <Icon icon="mdi:monitor-dashboard" size="24" />,
			},
			{
				title: "sys.nav.live_view",
				path: "/live-view",
				icon: <Icon icon="mdi:video-wireless" size="24" />,
			},
			{
				title: "sys.nav.recordings",
				path: "/recordings",
				icon: <Icon icon="mdi:filmstrip" size="24" />,
			},
		],
	},
	{
		name: "sys.nav.management",
		items: [
			{
				title: "sys.nav.permissions",
				path: "/permissions",
				icon: <Icon icon="mdi:lock" size="24" />,
				auth: ["view:permission"],
			},
			{
				title: "sys.nav.roles",
				path: "/roles",
				icon: <Icon icon="mdi:shield-account" size="24" />,
				auth: ["view:role"],
			},
			{
				title: "sys.nav.users",
				path: "/users",
				icon: <Icon icon="mdi:account" size="24" />,
				auth: ["view:user"],
			},
			{
				title: "sys.nav.devices",
				path: "/devices",
				icon: <Icon icon="mdi:devices" size="24" />,
				auth: ["view:device"],
			},
			{
				title: "sys.nav.sites",
				path: "/sites",
				icon: <Icon icon="mdi:map-marker" size="24" />,
				auth: ["view:site"],
			},
			{
				title: "sys.nav.groups",
				path: "/groups",
				icon: <Icon icon="mdi:select-group" size="24" />,
				auth: ["view:group"],
			},
		]
	},
];
