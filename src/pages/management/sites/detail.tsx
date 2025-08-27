import { useEffect, useState } from "react";
import siteService from "@/api/services/siteService";
import { Site } from "@/types/entity";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";
import { useNavigate, useParams } from "react-router";

export default function SiteDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [site, setSite] = useState<Site | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchSite = async () => {
            try {
                setLoading(true);
                const data = await siteService.fetchBySiteId(id);
                setSite(data || null);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch site", err);
                setError("Failed to load site details");
            } finally {
                setLoading(false);
            }
        };

        fetchSite();
    }, [id]);

    if (loading) {
        return <div className="p-6">Loading site details...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    if (!site) {
        return <div className="p-6">Site not found</div>;
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="w-fit"
            >
                ← Back to Sites
            </Button>
            
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <Text variant="body2" className="font-semibold">
                        Site: {site.name}
                    </Text>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">
                        Active
                    </span>
                </div>

                {/* Site Information */}
                <div className="mb-8">
                    <Text variant="body2" className="font-semibold mb-4 block">
                        Site Information
                    </Text>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <Text variant="body2" className="text-gray-500">ID</Text>
                                <Text variant="body1" className="font-medium">{site.id}</Text>
                            </div>
                            
                            <div>
                                <Text variant="body2" className="text-gray-500">Name</Text>
                                <Text variant="body1" className="font-medium">{site.name}</Text>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <Text variant="body2" className="text-gray-500">Address</Text>
                                <Text variant="body1" className="font-medium">
                                    {site.address || "N/A"}
                                </Text>
                            </div>
                            
                            <div>
                                <Text variant="body2" className="text-gray-500">Devices</Text>
                                <Text variant="body1" className="font-medium">
                                    {site.devices ? site.devices.length : 0} assigned
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assigned Devices */}
                <div>
                    <Text variant="body2" className="font-semibold mb-4 block">
                        Assigned Devices
                    </Text>
                    {site.devices && site.devices.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="py-2">Device Name</th>
                                        <th className="py-2">Version</th>
                                        <th className="py-2">Hostname</th>
                                        <th className="py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {site.devices.map((device) => (
                                        <tr key={device.id} className="border-b last:border-0">
                                            <td className="py-2 font-semibold">{device.name}</td>
                                            <td className="py-2">{device.version || "N/A"}</td>
                                            <td className="py-2">{device.hostname || "N/A"}</td>
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
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No devices assigned to this site
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}