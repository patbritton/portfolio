import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog');
  
  return rss({
    // The title of your feed (appears in Feedly/Reeder)
    title: "Patrick's Data Lab",
    description: 'Data engineering, visualization, and analytics experiments.',
    site: 'https://patrick.mp.ls',
    
    // The list of items
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // Compute the link: /blog/slug
      link: `/blog/${post.slug}/`,
    })),
    
    // Optional: customization
    customData: `<language>en-us</language>`,
  });
}