import style from './home.module.css';
import Tab from "@/app/(afterLogin)/home/_component/Tab";
import TabProvider from "@/app/(afterLogin)/home/_component/TabProvider";
import PostForm from "@/app/(afterLogin)/home/_component/PostForm";
import Post from "@/app/(afterLogin)/_component/Post";
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

/** 데이터를 불러오는 곳 */
async function getPostRecommends(){
  const res = await fetch(`http://localhost:9090/api/postRecommends`, {
    next : {
      tags: ['posts', 'recommends'],
    }
  })

  if(!res.ok){
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

const Home = async() => {

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey :  ['posts', 'recommends'], queryFn : 'getPostRecommends'})
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className={style.main}>
      <HydrationBoundary state={dehydratedState}>
      <TabProvider>
        <Tab />
        <PostForm />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </TabProvider>
      </HydrationBoundary>
    </main>
  );
};

export default Home;
