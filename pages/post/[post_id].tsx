import { useRouter } from 'next/router';
import { GET_POST_BY_POST_ID } from '../../graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import Post from '../../components/Post';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ADD_COMMENT } from '../../graphql/mutations';
import toast from 'react-hot-toast';
import Avatar from '../../components/Avatar';
import ReactTimeago from 'react-timeago';

type FormData = {
    comment: string;
};

const PostPage = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const { data } = useQuery(GET_POST_BY_POST_ID, {
        variables: {
            post_id: router.query.post_id,
        },
    });

    const post: Post = data?.postListByPostId;

    const [addComment] = useMutation(ADD_COMMENT, {
        refetchQueries: [GET_POST_BY_POST_ID, 'postListByPostId'],
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const notification = toast.loading('Posting your comment...');

        await addComment({
            variables: {
                post_id: router.query.post_id,
                username: session?.user?.name,
                text: data.comment,
            },
        });

        setValue('comment', '');

        toast.success('Comment successfully posted!', {
            id: notification,
        });
    };

    return (
        <div className='mx-auto my-7 max-w-5xl'>
            <Post post={post} />
            <div className='rouded-b-md -mt-1 border border-t-0 border-gray-300 bg-white p-5 pl-16'>
                <p className='text-sm '>
                    Comment as <span className='text-red-500'>{session?.user?.name}</span>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-2'>
                        <textarea {...register('comment')} disabled={!session} className='h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50' placeholder={session ? 'What are your thoughts?' : 'Please sign in to comment.'} />
                        <button disabled={!session} type='submit' className='rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200'>
                            Comment
                        </button>
                    </form>
                </p>
            </div>
            <div className='-my-5 rounded-b-md border-t-0 border-gray-300 bg-white py-5 px-10 '>
                <hr className='py-2' />
                {post?.comments.map((comment) => (
                    <div className='relative flex items-center space-x-2 space-y-5' key={comment.id}>
                        <hr className='absolute top-10 left-7 z-0 h-16 border ' />
                        <div className='z-50'>
                            <Avatar seed={comment.username} />
                        </div>
                        <div>
                            <p className='py-2 text-xs text-gray-400'>
                                <span className='font-semibold text-gray-600'>{comment.username}</span> • <ReactTimeago date={comment.created_at} />
                            </p>
                            <p>{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostPage;
