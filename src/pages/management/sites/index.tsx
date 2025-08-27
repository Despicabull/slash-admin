import siteService from "@/api/services/siteService";
import { Site } from "@/types/entity";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function SitesPage() {
    const navigate = useNavigate();
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSites = async () => {
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

        fetchSites();
    }, []);

    const handleRowClick = (id: string) => {
        navigate(`/management/sites/${id}`);
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
                                    className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(site.id)}
                                >
                                    <td className="py-2 font-semibold">{site.name}</td>
                                    <td className="py-2">{site.address || "N/A"}</td>
                                    <td className="py-2">
                                        {site.devices ? site.devices.length : 0} devices
                                    </td>
                                    <td className="py-2">
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {sites.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No sites found
                    </div>
                )}
            </Card>
        </div>
    );
}
