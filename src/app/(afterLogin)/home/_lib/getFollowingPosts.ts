/** 데이터를 불러오는 곳 */
export async function getFollowingPosts() {
  const res = await fetch(`http://localhost:9090/api/posts/followings`, {
    next: {
      tags: ["posts", "followings"],
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}