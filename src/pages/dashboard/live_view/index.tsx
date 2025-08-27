import deviceService from "@/api/services/deviceService";
import { Device } from "@/types/entity";
import { Text } from "@/ui/typography";
import { useEffect, useState } from "react";
import { CameraFeed } from "./camera-feed";
import { getDeviceStatus } from "@/utils/device";

function isDeviceOnline(device: Device): boolean {
    return getDeviceStatus(device.lastHeartbeat) === "online";
}

export default function LiveViewPage() {
    const [allDevices, setAllDevices] = useState<Device[]>([]);

    useEffect(() => {
        const getDevices = async () => {
            try {
                const data = await deviceService.fetchDevices();
                setAllDevices(data);
            } catch (error) {
                console.error("Failed to fetch devices", error);
            }
        };

        getDevices();
    }, []);

    const onlineDevices = allDevices.filter(isDeviceOnline);

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-4">
                <Text variant="body2" className="font-semibold">
                    Live Camera Feeds
                </Text>
                
                {/* Camera Feeds Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {onlineDevices.map((device) => (
                        <CameraFeed key={device.id} device={device} />
                    ))}
                </div>
            </div>
        </div>
    );
}
