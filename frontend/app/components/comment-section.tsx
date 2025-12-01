import { useState, useEffect } from 'react';
import { Textarea, Button, Avatar } from 'flowbite-react';
import { FaTrash } from 'react-icons/fa';

interface Comment {
    id: string;
    postId: string;
    profileId: string;
    comment: string;
    dateCreated: string;
}

interface CommentSectionProps {
    postId: string;
    authorization: string;
    cookie: string;
    currentProfileId: string;
}

export function CommentSection({ postId, authorization, cookie, currentProfileId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch comments for this post
    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/apis/comment/post/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${authorization}`,
                    'Cookie': cookie,
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setComments(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const commentData = {
                id: crypto.randomUUID(),
                postId: postId,
                profileId: currentProfileId,
                comment: newComment.trim()
            };

            const response = await fetch('http://localhost:8080/apis/comment', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authorization}`,
                    'Content-Type': 'application/json',
                    'Cookie': cookie,
                },
                credentials: 'include',
                body: JSON.stringify(commentData),
            });

            if (response.ok) {
                setNewComment('');
                fetchComments(); // Refresh comments
            } else {
                console.error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Delete this comment?')) return;

        try {
            const response = await fetch(`http://localhost:8080/apis/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authorization}`,
                    'Cookie': cookie,
                },
                credentials: 'include',
            });

            if (response.ok) {
                fetchComments(); // Refresh comments
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Comments ({comments.length})
            </h4>

            {/* Comments list */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {loading ? (
                    <p className="text-sm text-gray-500">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2 items-start">
                            <Avatar
                                rounded
                                size="sm"
                                img="https://i.pravatar.cc/150?img=68"
                            />
                            <div className="flex-1 bg-gray-100 rounded-lg p-2">
                                <p className="text-sm text-gray-800">{comment.comment}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(comment.dateCreated).toLocaleDateString()}
                                </p>
                            </div>
                            {comment.profileId === currentProfileId && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Delete comment"
                                >
                                    <FaTrash size={12} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Comment form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={2}
                    maxLength={160}
                    disabled={submitting}
                    className="flex-1"
                />
                <Button
                    type="submit"
                    size="sm"
                    disabled={submitting || !newComment.trim()}
                    className="self-end"
                >
                    {submitting ? 'Posting...' : 'Post'}
                </Button>
            </form>
        </div>
    );
}
