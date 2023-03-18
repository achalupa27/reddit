import { gql } from '@apollo/client';

export const GET_ALL_VOTES_BY_POST_ID = gql`
    query MyQuery($post_id: ID!) {
        voteListById(post_id: $post_id) {
            created_at
            id
            post_id
            upvote
            username
        }
    }
`;

export const GET_SUBREDDITS_WITH_LIMIT = gql`
    query MyQuery($limit: Int!) {
        subredditListLimit(limit: $limit) {
            created_at
            id
            topic
        }
    }
`;

export const GET_ALL_POSTS = gql`
    query MyQuery {
        postList {
            body
            title
            comments {
                created_at
                text
                post_id
                id
                username
            }
            created_at
            id
            image
            subreddit {
                created_at
                id
                topic
            }
            subreddit_id
            username
            votes {
                created_at
                id
                post_id
                upvote
                username
            }
        }
    }
`;

export const GET_ALL_POSTS_BY_TOPIC = gql`
    query MyQuery($topic: String!) {
        postListByTopic(topic: $topic) {
            body
            title
            comments {
                created_at
                text
                post_id
                id
                username
            }
            created_at
            id
            image
            subreddit {
                created_at
                id
                topic
            }
            subreddit_id
            username
            votes {
                created_at
                id
                post_id
                upvote
                username
            }
        }
    }
`;

export const GET_SUBREDDIT_BY_TOPIC = gql`
    query subredditListsQuery($topic: String!) {
        subredditListByTopic(topic: $topic) {
            id
            topic
            created_at
        }
    }
`;

export const GET_POST_BY_POST_ID = gql`
    query MyQuery($post_id: ID!) {
        postListByPostId(post_id: $post_id) {
            body
            title
            comments {
                created_at
                text
                post_id
                id
                username
            }
            created_at
            id
            image
            subreddit {
                created_at
                id
                topic
            }
            subreddit_id
            username
            votes {
                created_at
                id
                post_id
                upvote
                username
            }
        }
    }
`;
