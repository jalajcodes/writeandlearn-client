import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';
import Pagination from './Pagination';
import Post from './Post';

const ProfilePosts = () => {
	const [isLoading, setisLoading] = useState(true);
	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(null);
	const [totalPages, setTotalPages] = useState(null);
	const [currentPosts, setCurrentPosts] = useState([]);
	const { username } = useParams();

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function getPosts() {
			try {
				const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token });
				setPosts(response.data);
				setisLoading(false);
			} catch (e) {
				console.log('There was an error. Profileposts.jsx');
			}
		}
		getPosts();

		return () => {
			ourRequest.cancel();
		};
	}, [username]);

	const onPageChanged = (data) => {
		const allPosts = posts;

		const { currentPage, totalPages, pageLimit } = data;

		const offset = (currentPage - 1) * pageLimit;
		const currentPosts = allPosts.slice(offset, offset + pageLimit);
		// console.log(currentPosts);

		setCurrentPage(currentPage);
		setCurrentPosts(currentPosts);
		setTotalPages(totalPages);
	};

	if (isLoading) return <LoadingDotsIcon />;

	return (
		<div className="list-group">
			{currentPosts.map((post) => {
				return <Post do_not_show_author_name={true} key={post._id} post={post} />;
			})}

			<div className="d-flex flex-row py-4 align-items-center">
				<Pagination
					totalRecords={posts.length}
					pageLimit={5}
					pageNeighbours={2}
					onPageChanged={onPageChanged}
				/>
			</div>
		</div>
	);
};

export default ProfilePosts;
