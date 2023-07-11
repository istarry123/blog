import Layout from '@/components/layout';
import Card from '@/components/card';
import Pagination from '@/components/pagination';
import { allPosts, Post } from '@/.contentlayer/generated';
import dayjs from 'dayjs';
import feed from '@/utils/feed';
import sitemap from '@/utils/sitemap';
import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';

export function List({ posts, current, total }: { posts: Post[]; current: number; total: number }) {
    return (
        <Layout>
            <div className="resp space-y-16">
                {posts.map(post => (
                    <Card post={post} key={post.abbrlink} />
                ))}
                <Pagination current={current} total={total} />
            </div>
        </Layout>
    );
}

export default function Home({ posts, current, total }: { posts: Post[]; current: number; total: number }) {
    return (
        <>
            <NextSeo
                title="首页"
                canonical="https://blog.huanfei.top/"
                description="幻非的个人博客，记录一些技术或者想法"
            />
            <List posts={posts} current={current} total={total} />
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    if (process.env.NODE_ENV !== 'development') {
        sitemap();
        feed();
    }
    return {
        props: getPagePost(1),
    };
};

export function getPagePost(current: number) {
    // 每页显示文章数量
    const per_page = 6;
    allPosts.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
    const posts = allPosts
        .filter(post => !post.draft)
        .slice((current - 1) * per_page, per_page + (current - 1) * per_page)
        .map(post => ({
            title: post.title,
            date: dayjs(post.date).format('YYYY-MM-DD'),
            excerpt: post.excerpt,
            cover: post.cover,
            abbrlink: post.abbrlink,
        }));
    const total = Math.ceil(posts.length / per_page) + 1;
    return {
        posts,
        current,
        total,
    };
}