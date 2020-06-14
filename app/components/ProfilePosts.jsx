import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';

const ProfilePosts = () => {
	const [isLoading, setisLoading] = useState(true);
	const [posts, setPosts] = useState([]);
	const { username } = useParams();

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function getPosts() {
			try {
				const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token });
				setisLoading(false);
				setPosts(response.data);
			} catch (e) {
				console.log('There was an error. Profileposts.jsx');
			}
		}
		getPosts();
		return () => {
			ourRequest.cancel();
		};
	}, []);

	if (isLoading) return <LoadingDotsIcon />;

	return (
		<div className="list-group">
			{posts.map((post) => {
				const date = new Date(post.createdDate);
				const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

				return (
					<Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
						<img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{' '}
						<span className="text-muted small">on {formattedDate} </span>
					</Link>
				);
			})}
		</div>
	);
};

export default ProfilePosts;
