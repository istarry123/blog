import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { metadata } from '@/app/layout';
import Comment from '@/components/common/comment';
import Markdown from '@/components/markdown';
import { PostProps, getAllPosts } from '@/utils/data';

import Header from './header';
import Toc from './toc';

export async function generateMetadata({ params }): Promise<Metadata> {
    const post = await getAllPosts().then(posts => posts.find(post => post.slug === params.id));
    if (!post) notFound();
    return {
        title: `${post.title}`,
        description: post.summary,
        keywords: [...(metadata.keywords as string[]), ...(post.tags ? post.tags : [])],
        openGraph: {
            title: post.title,
            description: post.summary,
            type: 'article',
            publishedTime: post.date,
            modifiedTime: post.update || post.date,
            authors: ['https://www.huanfei.top'],
            tags: post.tags,
            images: post.cover,
            url: '/post/' + post.slug,
        },
        alternates: {
            canonical: '/post/' + post.slug,
        },
        other: { 'giscus:backlink': 'https://www.huanfei.top/post/' + post.slug },
    };
}

export default async function Post({ params }) {
    const post: PostProps | undefined = await getAllPosts().then(posts => posts.find(post => post.slug === params.id));
    if (!post) notFound();
    return (
        <>
            <article>
                <Header post={post} />
                <section id="post">
                    <Markdown>{post.content}</Markdown>
                </section>
            </article>
            <Toc content={post.toc} />
            <Comment />
        </>
    );
}

export async function generateStaticParams() {
    const posts: PostProps[] = await getAllPosts();
    return posts.map(post => ({ id: post.slug }));
}
