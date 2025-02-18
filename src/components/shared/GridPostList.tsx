import { useUserContext } from "@/contexts/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              className="w-full h-full object-cover"
              src={post.imageUrl}
              alt={post.caption}
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <Link
                to={`/profile/${post.creator.$id}`}
                className="flex items-center justify-start gap-2 flex-1"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={post.creator.imageUrl}
                  alt={post.creator.name}
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </Link>
            )}

            {showStats && <PostStats userId={user.id} post={post} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
