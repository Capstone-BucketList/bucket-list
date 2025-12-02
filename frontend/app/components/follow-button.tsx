import { useState } from 'react';
import { Button } from 'flowbite-react';

interface FollowButtonProps {
    profileId: string;
    initialFollowing?: boolean;
    authorization: string;
    cookie: string;
    onFollowChange?: (following: boolean) => void;
}

export function FollowButton({
    profileId,
    initialFollowing = false,
    authorization,
    cookie,
    onFollowChange
}: FollowButtonProps) {
    const [following, setFollowing] = useState(initialFollowing);
    const [loading, setLoading] = useState(false);

    const handleFollow = async () => {
        setLoading(true);
        const previousState = following;

        // Optimistic update
        setFollowing(!following);

        try {
            const url = `http://localhost:8080/apis/follow/${profileId}`;
            const method = following ? 'DELETE' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${authorization}`,
                    'Cookie': cookie,
                },
                credentials: 'include',
            });

            if (response.ok) {
                // Notify parent component of change
                onFollowChange?.(!following);
            } else {
                // Rollback on error
                setFollowing(previousState);
                console.error('Failed to update follow status');
            }
        } catch (error) {
            // Rollback on error
            setFollowing(previousState);
            console.error('Error updating follow status:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            size="xs"
            color={following ? 'gray' : 'info'}
            onClick={handleFollow}
            disabled={loading}
        >
            {loading ? '...' : following ? 'Unfollow' : 'Follow'}
        </Button>
    );
}
