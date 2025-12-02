import { useState, useEffect } from 'react';
import { Card, Button, Badge, Avatar, TextInput, Textarea, Tabs } from 'flowbite-react';
import { FaUsers, FaGlobeAmericas, FaHiking, FaPlane, FaCamera, FaPlusCircle, FaUserFriends, FaHeart, FaCompass } from 'react-icons/fa';
import { useLoaderData, redirect } from 'react-router';
import type { Route } from "../../.react-router/types/app/routes/+types/groups";
import { getSession } from "~/utils/session.server";
import { addHeaders } from '~/utils/utility';

export async function loader({ request }: Route.LoaderArgs) {
    const cookie = request.headers.get('Cookie');
    const session = await getSession(cookie);
    const authorization = session.get('authorization');
    const profile = session.get('profile');

    if (!profile || !authorization || !cookie) {
        return redirect('/login');
    }

    return { profile, authorization, cookie };
}

interface GroupGoal {
    id: string;
    title: string;
    description: string;
    category: string;
    memberCount: number;
    image: string;
    members: { id: number; name: string; avatarUrl: string }[];
}

interface Connection {
    id: string;
    userName: string;
    profilePicture: string;
    bio: string;
    email: string;
}

export default function Groups() {
    const { profile, authorization, cookie } = useLoaderData<typeof loader>();

    const [activeTab, setActiveTab] = useState<'groups' | 'network'>('groups');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newGroupTitle, setNewGroupTitle] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [newGroupCategory, setNewGroupCategory] = useState('travel');

    // Network state
    const [followers, setFollowers] = useState<Connection[]>([]);
    const [following, setFollowing] = useState<Connection[]>([]);
    const [suggestedProfiles, setSuggestedProfiles] = useState<Connection[]>([]);
    const [loadingNetwork, setLoadingNetwork] = useState(false);

    // Static group goal examples
    const [groupGoals, setGroupGoals] = useState<GroupGoal[]>([
        {
            id: '1',
            title: 'Group Trip to Iceland',
            description: 'Join fellow adventurers for an epic Iceland road trip! We\'ll see waterfalls, glaciers, hot springs, and the Northern Lights.',
            category: 'Travel',
            memberCount: 12,
            image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73',
            members: [
                { id: 1, name: 'Sarah', avatarUrl: 'https://i.pravatar.cc/150?img=25' },
                { id: 2, name: 'Mike', avatarUrl: 'https://i.pravatar.cc/150?img=12' },
                { id: 3, name: 'Emma', avatarUrl: 'https://i.pravatar.cc/150?img=44' },
            ]
        },
        {
            id: '2',
            title: 'Hot Air Balloon Adventure',
            description: 'Experience the thrill of floating above the clouds! Looking for 8-10 people to book a group hot air balloon ride in Cappadocia.',
            category: 'Adventure',
            memberCount: 6,
            image: 'https://images.unsplash.com/photo-1498496294664-d9372eb521f3',
            members: [
                { id: 4, name: 'John', avatarUrl: 'https://i.pravatar.cc/150?img=33' },
                { id: 5, name: 'Lisa', avatarUrl: 'https://i.pravatar.cc/150?img=27' },
            ]
        },
        {
            id: '3',
            title: 'Photography Hike - Yosemite',
            description: 'Calling all photography enthusiasts! Let\'s hike Yosemite together and capture stunning landscapes. All skill levels welcome.',
            category: 'Photography',
            memberCount: 8,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
            members: [
                { id: 6, name: 'Alex', avatarUrl: 'https://i.pravatar.cc/150?img=15' },
                { id: 7, name: 'Maya', avatarUrl: 'https://i.pravatar.cc/150?img=41' },
                { id: 8, name: 'Tom', avatarUrl: 'https://i.pravatar.cc/150?img=52' },
            ]
        },
        {
            id: '4',
            title: 'Marathon Training Group',
            description: 'Training for your first marathon? Join our supportive group! We meet 3x/week for long runs and share tips and motivation.',
            category: 'Fitness',
            memberCount: 15,
            image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3',
            members: [
                { id: 9, name: 'Chris', avatarUrl: 'https://i.pravatar.cc/150?img=18' },
                { id: 10, name: 'Nina', avatarUrl: 'https://i.pravatar.cc/150?img=38' },
            ]
        },
        {
            id: '5',
            title: 'European Backpacking Tour',
            description: 'Planning a 3-week backpacking adventure through Europe. Looking for travel buddies to explore Paris, Rome, Barcelona, and more!',
            category: 'Travel',
            memberCount: 5,
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828',
            members: [
                { id: 11, name: 'David', avatarUrl: 'https://i.pravatar.cc/150?img=60' },
                { id: 12, name: 'Sophie', avatarUrl: 'https://i.pravatar.cc/150?img=47' },
            ]
        },
    ]);

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'travel':
                return <FaPlane className="text-blue-500" />;
            case 'adventure':
                return <FaHiking className="text-green-500" />;
            case 'photography':
                return <FaCamera className="text-purple-500" />;
            case 'fitness':
                return <FaGlobeAmericas className="text-orange-500" />;
            default:
                return <FaUsers className="text-gray-500" />;
        }
    };

    const handleCreateGroup = () => {
        if (!newGroupTitle.trim() || !newGroupDescription.trim()) {
            return;
        }

        const newGroup: GroupGoal = {
            id: crypto.randomUUID(),
            title: newGroupTitle,
            description: newGroupDescription,
            category: newGroupCategory,
            memberCount: 1,
            image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18',
            members: [
                {
                    id: parseInt(profile.id),
                    name: profile.user_name || 'You',
                    avatarUrl: profile.profile_picture || 'https://i.pravatar.cc/150?img=68'
                }
            ]
        };

        setGroupGoals([newGroup, ...groupGoals]);
        setNewGroupTitle('');
        setNewGroupDescription('');
        setShowCreateForm(false);
    };

    // Fetch network data when Network tab is active
    useEffect(() => {
        if (activeTab === 'network') {
            fetchNetworkData();
        }
    }, [activeTab]);

    const fetchNetworkData = async () => {
        setLoadingNetwork(true);
        try {
            // Fetch followers
            const followersRes = await fetch(`http://localhost:8080/apis/profile/followers/${profile.id}`, {
                headers: addHeaders(authorization, cookie),
                credentials: 'include',
            });
            const followersData = followersRes.ok ? await followersRes.json() : { data: [] };
            setFollowers(followersData.data || []);

            // Fetch following
            const followingRes = await fetch(`http://localhost:8080/apis/profile/following/${profile.id}`, {
                headers: addHeaders(authorization, cookie),
                credentials: 'include',
            });
            const followingData = followingRes.ok ? await followingRes.json() : { data: [] };
            setFollowing(followingData.data || []);

            // Fetch all public profiles for suggestions
            const suggestionsRes = await fetch('http://localhost:8080/apis/profile/', {
                headers: addHeaders(authorization, cookie),
                credentials: 'include',
            });
            if (suggestionsRes.ok) {
                const suggestionsData = await suggestionsRes.json();
                // Filter out current user and already following
                const allProfiles = suggestionsData.data || [];
                const followingIds = new Set((followingData.data || []).map((f: Connection) => f.id));
                const filtered = allProfiles.filter((p: Connection) =>
                    p.id !== profile.id && !followingIds.has(p.id)
                ).slice(0, 6);
                setSuggestedProfiles(filtered);
            }
        } catch (error) {
            console.error('Error fetching network data:', error);
        } finally {
            setLoadingNetwork(false);
        }
    };

    const handleFollowToggle = async (profileId: string, isFollowing: boolean) => {
        try {
            const url = `http://localhost:8080/apis/follow/${profileId}`;
            const method = isFollowing ? 'DELETE' : 'POST';

            const response = await fetch(url, {
                method,
                headers: addHeaders(authorization, cookie),
                credentials: 'include',
            });

            if (response.ok) {
                // Refresh network data
                fetchNetworkData();
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 pb-20">
            {/* HERO SECTION WITH TABS */}
            <section className={`${activeTab === 'groups' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-violet-600 to-purple-600'} text-white py-20 px-6`}>
                <div className="max-w-6xl mx-auto text-center">
                    {activeTab === 'groups' ? (
                        <>
                            <FaUsers className="text-6xl mx-auto mb-4" />
                            <h1 className="text-5xl font-extrabold">Group Goals</h1>
                            <p className="text-lg mt-4 opacity-90 max-w-2xl mx-auto">
                                Connect with others who share your wanderlist! Join group adventures or create your own.
                            </p>
                        </>
                    ) : (
                        <>
                            <FaUserFriends className="text-6xl mx-auto mb-4" />
                            <h1 className="text-5xl font-extrabold">Your Network</h1>
                            <p className="text-lg mt-4 opacity-90 max-w-2xl mx-auto">
                                Build meaningful connections with fellow adventurers and discover shared goals.
                            </p>
                        </>
                    )}

                    {/* Tab Navigation */}
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            onClick={() => setActiveTab('groups')}
                            className={`${activeTab === 'groups' ? 'bg-white text-blue-600' : 'bg-transparent border-2 border-white text-white'} px-8`}
                        >
                            <FaUsers className="mr-2" /> Group Goals
                        </Button>
                        <Button
                            onClick={() => setActiveTab('network')}
                            className={`${activeTab === 'network' ? 'bg-white text-purple-600' : 'bg-transparent border-2 border-white text-white'} px-8`}
                        >
                            <FaUserFriends className="mr-2" /> Your Network
                        </Button>
                    </div>
                </div>
            </section>

            {/* CONDITIONAL CONTENT BASED ON ACTIVE TAB */}
            {activeTab === 'groups' ? (
                <>
                    {/* CREATE GROUP BUTTON */}
                    <section className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex justify-end">
                            <Button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className="bg-indigo-600 flex items-center gap-2"
                            >
                                <FaPlusCircle /> Create Group Goal
                            </Button>
                        </div>

                {/* CREATE GROUP FORM */}
                {showCreateForm && (
                    <Card className="mt-6 p-6 bg-blue-50 border-2 border-blue-200">
                        <h3 className="text-2xl font-bold mb-4 text-blue-800">Create a New Group Goal</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                                <TextInput
                                    type="text"
                                    placeholder="Enter group goal title"
                                    value={newGroupTitle}
                                    onChange={(e) => setNewGroupTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                                <Textarea
                                    placeholder="Describe your group goal..."
                                    rows={4}
                                    value={newGroupDescription}
                                    onChange={(e) => setNewGroupDescription(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                                <select
                                    className="block w-full rounded-lg border border-gray-300 p-2"
                                    value={newGroupCategory}
                                    onChange={(e) => setNewGroupCategory(e.target.value)}
                                >
                                    <option value="travel">Travel</option>
                                    <option value="adventure">Adventure</option>
                                    <option value="photography">Photography</option>
                                    <option value="fitness">Fitness</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleCreateGroup} className="bg-blue-600">
                                    Create Group
                                </Button>
                                <Button onClick={() => setShowCreateForm(false)} color="gray">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </section>

            {/* GROUP GOALS GRID */}
            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupGoals.map((group) => (
                        <Card key={group.id} className="shadow-md hover:shadow-xl transition">
                            <img
                                src={group.image}
                                alt={group.title}
                                className="rounded-t-lg h-48 w-full object-cover"
                            />
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {getCategoryIcon(group.category)}
                                    <Badge color="info">{group.category}</Badge>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-2">{group.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{group.description}</p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex -space-x-2">
                                        {group.members.slice(0, 3).map((member) => (
                                            <Avatar
                                                key={member.id}
                                                img={member.avatarUrl}
                                                rounded
                                                size="sm"
                                                className="border-2 border-white"
                                            />
                                        ))}
                                        {group.memberCount > 3 && (
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 border-2 border-white text-xs font-semibold">
                                                +{group.memberCount - 3}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-600 flex items-center gap-1">
                                        <FaUsers /> {group.memberCount} members
                                    </span>
                                </div>

                                <Button size="sm" className="w-full bg-indigo-600">
                                    Join Group
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
                </>
            ) : (
                <>
                    {/* YOUR NETWORK CONTENT */}
                    <section className="max-w-7xl mx-auto px-6 py-8">
                        {loadingNetwork ? (
                            <div className="text-center py-20">
                                <p className="text-gray-600">Loading your network...</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* YOUR CONNECTIONS */}
                                <div>
                                    <h2 className="text-3xl font-bold text-purple-800 mb-6 flex items-center gap-2">
                                        <FaUserFriends /> Your Connections
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        {/* Followers */}
                                        <Card className="bg-violet-50 border-2 border-violet-200">
                                            <h3 className="text-xl font-bold text-violet-800 mb-4">
                                                Followers ({followers.length})
                                            </h3>
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {followers.length === 0 ? (
                                                    <p className="text-gray-600 text-sm">No followers yet.</p>
                                                ) : (
                                                    followers.map((follower) => (
                                                        <div key={follower.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar
                                                                    img={follower.profilePicture || 'https://i.pravatar.cc/150'}
                                                                    rounded
                                                                    size="sm"
                                                                />
                                                                <div>
                                                                    <p className="font-semibold text-gray-800">{follower.userName}</p>
                                                                    <p className="text-xs text-gray-500">{follower.bio?.slice(0, 40) || 'No bio'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </Card>

                                        {/* Following */}
                                        <Card className="bg-purple-50 border-2 border-purple-200">
                                            <h3 className="text-xl font-bold text-purple-800 mb-4">
                                                Following ({following.length})
                                            </h3>
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {following.length === 0 ? (
                                                    <p className="text-gray-600 text-sm">Not following anyone yet.</p>
                                                ) : (
                                                    following.map((user) => (
                                                        <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar
                                                                    img={user.profilePicture || 'https://i.pravatar.cc/150'}
                                                                    rounded
                                                                    size="sm"
                                                                />
                                                                <div>
                                                                    <p className="font-semibold text-gray-800">{user.userName}</p>
                                                                    <p className="text-xs text-gray-500">{user.bio?.slice(0, 40) || 'No bio'}</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                size="xs"
                                                                color="light"
                                                                onClick={() => handleFollowToggle(user.id, true)}
                                                            >
                                                                Unfollow
                                                            </Button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                {/* SUGGESTED CONNECTIONS */}
                                <div>
                                    <h2 className="text-3xl font-bold text-purple-800 mb-6 flex items-center gap-2">
                                        <FaCompass /> Suggested Connections
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {suggestedProfiles.length === 0 ? (
                                            <p className="text-gray-600">No suggestions available at the moment.</p>
                                        ) : (
                                            suggestedProfiles.map((suggested) => (
                                                <Card key={suggested.id} className="shadow-md hover:shadow-xl transition">
                                                    <div className="text-center">
                                                        <Avatar
                                                            img={suggested.profilePicture || 'https://i.pravatar.cc/150'}
                                                            rounded
                                                            size="lg"
                                                            className="mx-auto mb-3"
                                                        />
                                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{suggested.userName}</h3>
                                                        <p className="text-sm text-gray-600 mb-4">{suggested.bio?.slice(0, 60) || 'Adventurer'}</p>
                                                        <Button
                                                            size="sm"
                                                            className="w-full bg-purple-600"
                                                            onClick={() => handleFollowToggle(suggested.id, false)}
                                                        >
                                                            <FaHeart className="mr-2" /> Follow
                                                        </Button>
                                                    </div>
                                                </Card>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}
