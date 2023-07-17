import fs from 'fs';
import { allPosts } from '@/.contentlayer/generated';
import dayjs from 'dayjs';

allPosts.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
const url: string = 'https://blog.huanfei.top';

function xml() {
    const header = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const posts = allPosts
        .filter(post => !post.draft)
        .map(post =>
            [
                '<url>',
                `<loc>${url}/post/${post.abbrlink}</loc>`,
                `<lastmod>${dayjs(post.date).toISOString()}</lastmod>`,
                '</url>',
            ].join('')
        )
        .join('');
    const other = ['/about', '/archive'].map(_ => `<url><loc>${url + _}</loc></url>`).join('');
    const content = [posts, other].join('');
    return [header, content, '</urlset>'].join('');
}

const txt: string = allPosts
    .filter(post => !post.draft)
    .map(post => `${url}/post/${post.abbrlink}`)
    .join('\n');

const generatedTxt = [url, txt, url + '/about', url + '/archive'].join('\n');

export default function Sitemap() {
    // const content = [header, ...posts].join('') + '</urlset>';
    fs.writeFileSync('./public/sitemap.xml', xml());
    fs.writeFileSync('./public/sitemap.txt', generatedTxt);
}
