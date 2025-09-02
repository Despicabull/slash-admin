import { useEffect, useState } from "react";
import siteService from "@/api/services/siteService";
import EntityModal from "@/components/management/EntityModal";
import type { Site } from "@/types/entity";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";

export default function SitesPage() {
	const [sites, setSites] = useState<Site[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSite, setSelectedSite] = useState<Site | null>(null);

	useEffect(() => {
		const getSites = async () => {
			try {
				setLoading(true);
				const data = await siteService.fetchSites();
				setSites(data);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch sites", err);
				setError("Failed to load sites");
			} finally {
				setLoading(false);
			}
		};

		getSites();
	}, []);

	const handleRowClick = (site: Site) => {
		setSelectedSite(site);
		setIsModalOpen(true);
	};

	const handleCreateSite = () => {
		setSelectedSite(null);
		setIsModalOpen(true);
	};

	const handleSaveSite = async (data: any) => {
		try {
			if (selectedSite) {
				// Update existing site
				await siteService.updateSite(selectedSite.id, data);
			} else {
				// Create new site
				await siteService.createSite(data);
			}
			// Refresh the list
			const updatedSites = await siteService.fetchSites();
			setSites(updatedSites);
		} catch (err) {
			console.error("Failed to save site", err);
			throw err;
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		// Delay resetting selectedSite to prevent title flicker during modal close animation
		setTimeout(() => {
			setSelectedSite(null);
		}, 150);
	};

	if (loading) {
		return <div className="p-6">Loading sites...</div>;
	}

	if (error) {
		return <div className="p-6 text-red-500">{error}</div>;
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			<Card className="flex flex-col p-6">
				<div className="flex items-center gap-4 mb-4">
					<Text variant="body2" className="font-semibold">
						Sites
					</Text>
					<Button onClick={handleCreateSite} size="sm">
						Add Site
					</Button>
				</div>
				<div className="flex-1 overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left border-b">
								<th className="py-2">Name</th>
								<th className="py-2">Address</th>
								<th className="py-2">Devices</th>
								<th className="py-2">Status</th>
							</tr>
						</thead>
						<tbody>
							{sites.map((site) => (
								<tr
									key={site.id}
									className="border-b last:border-0 cursor-pointer"
									onClick={() => handleRowClick(site)}
								>
									<td className="py-2 font-semibold">{site.name}</td>
									<td className="py-2">{site.address || "N/A"}</td>
									<td className="py-2">{site.devices ? site.devices.length : 0} devices</td>
									<td className="py-2">
										<span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">Active</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{sites.length === 0 && <div className="text-center py-8 text-gray-500">No sites found</div>}
			</Card>

			<EntityModal
				open={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={handleSaveSite}
				title={selectedSite ? "Edit Site" : "Add Site"}
				entity={selectedSite}
				entityType="site"
			/>
		</div>
	);
}
