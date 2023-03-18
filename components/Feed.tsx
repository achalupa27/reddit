import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from '../graphql/queries';
import Post from './Post';

type Props = {
    topic?: string;
};

const Feed = ({ topic }: Props) => {
    const { data, error } = !topic
        ? useQuery(GET_ALL_POSTS)
        : useQuery(GET_ALL_POSTS_BY_TOPIC, {
              variables: {
                  topic: topic,
              },
          });
    console.log('posts: ', data);

    const posts: Post[] = !topic ? data?.postList : data?.postListByTopic;

    return (
        <div className='mt-5 w-full space-y-4'>
            {posts?.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
};

export default Feed;
