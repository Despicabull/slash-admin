import { Device } from "@/types/entity";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";
import { Button } from "@/ui/button";
import { useState } from "react";
import { getDeviceStatus } from "@/utils/device";

interface CameraFeedProps {
  device: Device;
}

export function CameraFeed({ device }: CameraFeedProps) {
  const [isHD, setIsHD] = useState(false);
  const status = getDeviceStatus(device.lastHeartbeat);

  return (
    <Card className="flex flex-col p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <Text variant="body2" className="font-semibold">
            {device.name}
          </Text>
          <Text 
            variant="caption" 
            className={status === "online" ? "text-green-500" : "text-red-500"}
          >
            {status}
          </Text>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsHD(!isHD)}
        >
          {isHD ? "HD" : "SD"}
        </Button>
      </div>
      <div className="relative aspect-video bg-gray-200 rounded-md overflow-hidden">
        {/* In a real app, this would be a video element with the actual stream */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Text variant="caption" className="text-gray-500">
            {isHD ? "HD" : "SD"} Feed
          </Text>
        </div>
        {/* Placeholder for video feed */}
        <img 
          src={`https://placehold.co/640x360/${isHD ? '0000ff' : '00aa00'}/ffffff?text=${isHD ? 'HD+Feed' : 'SD+Feed'}`} 
          alt={`Video feed for ${device.name}`}
          className="w-full h-full object-cover"
        />
      </div>
    </Card>
  );
}
