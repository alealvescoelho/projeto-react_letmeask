import "../styles/room-card.scss";


type RoomProps = {
    id: string;
    title: string;
    authorId: string;
    endedAt?: string;
};

export function RoomCard ({
    id,
    title,
    authorId,
    endedAt
}: RoomProps) {
    return (
        <div className="room-card">
            {id}-{title}
        </div>
    );
}