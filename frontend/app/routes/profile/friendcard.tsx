export function FriendCard({
    name,
    img,
}: {
    name: string;
    img: string;
}) {
    return (
        <div className="flex items-center gap-4">
            <img
                className="w-12 h-12 rounded-full object-cover"
                src={img}
                alt={`${name} avatar`}
            />
            <div>
                <p className="font-semibold text-gray-900">{name}</p>
            </div>
        </div>
    );
}