import { useSession } from 'next-auth/react';
import Avatar from './Avatar';
import { LinkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations';
import client from '../apollo-client';
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries';
import toast from 'react-hot-toast';

type FormData = {
    postTitle: string;
    postBody: string;
    postImage: string;
    subreddit: string;
};

type Props = {
    subreddit?: string;
};

const PostBox = ({ subreddit }: Props) => {
    const { data: session } = useSession();

    const [addPost] = useMutation(ADD_POST, { refetchQueries: [GET_ALL_POSTS, 'postList'] });
    const [addSubreddit] = useMutation(ADD_SUBREDDIT);

    const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false);
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = handleSubmit(async (formData) => {
        console.log(formData);
        const notification = toast.loading('Creating new post');

        try {
            // Query the subreddit topic
            console.log('query for subreddit ', formData.subreddit);
            const {
                data: { subredditListByTopic },
            } = await client.query({
                query: GET_SUBREDDIT_BY_TOPIC,
                variables: {
                    topic: subreddit || formData.subreddit,
                },
            });

            // Check if subreddit user entered already exists
            const subredditExists = subredditListByTopic.length > 0;
            if (!subredditExists) {
                // Create new subreddit
                console.log('Creating new subreddit ', formData.subreddit);
                const {
                    data: { insertSubreddit: newSubreddit },
                } = await addSubreddit({
                    variables: {
                        topic: formData.subreddit,
                    },
                });

                // Create Post
                const image = formData.postImage || '';

                const {
                    data: { insertPost: newPost },
                } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: newSubreddit.id,
                        title: formData.postTitle,
                        username: session?.user?.name,
                    },
                });

                console.log('New post added ', newPost);
            } else {
                console.log('Inserting into existing subreddit');
                // Use existing subreddit
                const image = formData.postImage || '';

                const {
                    data: { insertPost: newPost },
                } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: subredditListByTopic[0].id,
                        title: formData.postTitle,
                        username: session?.user?.name,
                    },
                });
            }

            setValue('postBody', '');
            setValue('postImage', '');
            setValue('postTitle', '');
            setValue('subreddit', '');

            toast.success('New Post Created!', {
                id: notification,
            });
        } catch (error) {
            console.log('error creating post: ', error);
            toast.error('Error creating post :(', {
                id: notification,
            });
        }
    });

    return (
        <form onSubmit={onSubmit} className='sticky top-16 z-50 rounded-md border border-gray-300 bg-white p-2'>
            <div className='flex items-center space-x-3'>
                <Avatar seed='oop' />
                <input {...register('postTitle', { required: true })} disabled={!session} className='flex-1 rounded-md border border-gray-100 bg-gray-50 p-2 pl-5 outline-none' type='text' placeholder={session ? (subreddit ? `Create a post in r/${subreddit}` : 'Create Post') : 'Sign in to create a post.'} />

                <PhotoIcon onClick={() => setImageBoxOpen(!imageBoxOpen)} className={`h-6 cursor-pointer text-gray-300 ${imageBoxOpen && 'text-blue-300'}`} />
                <LinkIcon className='h-6 cursor-not-allowed text-gray-300' />
            </div>
            {!!watch('postTitle') && (
                <div className='flex flex-col py-2'>
                    <div className='flex items-center px-2'>
                        <p className='min-w-[90px]'>Body:</p>
                        <input className='m-2 flex-1 bg-blue-50 p-2 outline-none' {...register('postBody')} type='text' placeholder='Text (Optional)' />
                    </div>
                    {!subreddit && (
                        <div className='flex items-center px-2'>
                            <p className='min-w-[90px]'>Subreddit:</p>
                            <input className='m-2 flex-1 bg-blue-50 p-2 outline-none' {...register('subreddit', { required: true })} type='text' placeholder='ex reactjs' />
                        </div>
                    )}
                    {imageBoxOpen && (
                        <div className='flex items-center px-2'>
                            <p className='min-w-[90px]'>Image URL:</p>
                            <input className='m-2 flex-1 bg-blue-50 p-2 outline-none' {...register('postImage')} type='text' placeholder='Optional' />
                        </div>
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div className='space-y-2 p-2 text-red-500'>
                            {errors.postTitle?.type == 'required' && <p>Post Title is required.</p>}
                            {errors.subreddit?.type == 'required' && <p>Subreddit is required.</p>}
                        </div>
                    )}
                    {!!watch('postTitle') && (
                        <button type='submit' className='w-full rounded-full bg-blue-400 p-2 text-white hover:bg-blue-500'>
                            Create Post
                        </button>
                    )}
                </div>
            )}
        </form>
    );
};

export default PostBox;
