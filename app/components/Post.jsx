import React from 'react';
import { Link } from 'react-router-dom';

const Post = ({ post, onClick, do_not_show_author_name }) => {
	const date = new Date(post.createdDate);
	const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
	return (
		<Link onClick={onClick} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
			<img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{' '}
			<span className="text-muted small">
				{!do_not_show_author_name && <>by {post.author.username}</>} on {formattedDate}
			</span>
		</Link>
	);
};

export default Post;
