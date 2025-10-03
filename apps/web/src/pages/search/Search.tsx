import { useState } from "react";
import UserCard from "./components/UserCard";
import PostCard from "./components/PostCard";
import SearchIcon from "@/assets/icons/search.svg";
import { usePostSearch, useSearchUsers } from "@/hooks/user.hook";
import type { SearchPost, SearchUser } from "@/types/user";

const SearchUser = ({ search }: { search: string }) => {
  const { data: usersResult } = useSearchUsers(search, 1);

  return (
    <>
      {usersResult ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {usersResult?.users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center h-[30vh] text-2xl font-bold">
          کاربری با این اطلاعات وجود ندارد
        </div>
      )}
    </>
  );
};

const SearchPost = ({ search }: { search: string }) => {
  const { data: postsResult } = usePostSearch(search, 1);

  return (
    <>
      {postsResult ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {postsResult?.posts.map((post) => (
            <PostCard key={post.id} image={post.urls[0]} />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center h-[30vh] text-2xl font-bold">
          پستی با این اطلاعات وجود ندارد
        </div>
      )}
    </>
  );
};

const Search = () => {
  const [activeTab, setActiveTab] = useState<"users" | "posts">("posts");
  const [search, setSearch] = useState("");

  return (
    <div className="w-full mx-auto">
      <div className="w-full md:w-4/5 lg:w-2/5 relative mb-12">
        <input
          type="text"
          placeholder="جستجو در افراد، تگ‌ها و واژه ها و..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white py-3 px-10 rounded-3xl focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <span className="absolute left-3 top-2.5 text-gray-300">
          <img src={SearchIcon} />
        </span>
      </div>

      <div className="flex mb-12 text-xl flex flex-row items-center">
        <button
          className={`pl-8 py-2 ${
            activeTab === "users" ? "font-bold" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("users")}>
          افراد
        </button>
        <span className="border-l h-5" />
        <button
          className={`px-8 py-2 ${
            activeTab === "posts" ? "font-bold" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("posts")}>
          پست‌ها
        </button>
      </div>

      {activeTab === "posts" ? (
        <SearchPost search={search} />
      ) : (
        <SearchUser search={search} />
      )}
    </div>
  );
};

export default Search;
