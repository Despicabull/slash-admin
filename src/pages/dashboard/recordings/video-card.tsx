import { Card, CardContent } from "@/ui/card";
import { Text } from "@/ui/typography";
import { useState } from "react";
import type { RecordingInfo } from "#/entity";

export interface VideoCardProps {
    recording: RecordingInfo;
}

export const VideoCard = ({ recording }: VideoCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const { videoSrc, startTime, endTime, deviceName } = recording;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const monthDay = startDate.toLocaleDateString([], { month: 'long', day: 'numeric' });
    const startHours = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const endHours = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    return (
        <>
            <Card 
                className="flex flex-col justify-between h-full cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={handleCardClick}
            >
                <CardContent className="p-4">
                    <video 
                        src={videoSrc} 
                        className="w-full aspect-video object-cover rounded mb-4 pointer-events-none"
                        preload="metadata"
                        muted
                    />
                    <Text>{monthDay}</Text>
                    <Text>{startHours} - {endHours}</Text>
                    <Text>{deviceName}</Text>
                </CardContent>
            </Card>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <Text className="text-lg font-semibold">Recording</Text>
                            <button 
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <video 
                            src={videoSrc} 
                            controls 
                            autoPlay
                            className="w-full h-auto rounded"
                        >
                            Your browser does not support the video tag.
                        </video>
                        <div className="mt-4 text-sm text-gray-600">
                            <Text>{deviceName} | {monthDay} | {startHours} - {endHours}</Text>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
