const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

// Configure marked for security
marked.setOptions({
  headerIds: false,
  mangle: false
});

// Ensure build directory exists
fs.ensureDirSync('build');

// Copy static assets
fs.copySync('src/assets', 'build/assets', { overwrite: true });
fs.copySync('src/styles', 'build/styles', { overwrite: true });
fs.copySync('src/scripts', 'build/scripts', { overwrite: true });

// Copy index.html directly
fs.copySync('src/index.html', 'build/index.html', { overwrite: true });

// Process Markdown files
function processMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);
  const html = marked(markdownContent);
  
  return {
    metadata: data,
    content: html
  };
}

// Read template
const template = fs.readFileSync('src/templates/base.html', 'utf-8');

// Process pages
const pagesDir = 'src/content/pages';
fs.readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.md') && file !== 'index.md') {  // Skip index.md if it exists
    const { metadata, content } = processMarkdown(path.join(pagesDir, file));
    const pageHtml = template
      .replace('{{title}}', metadata.title || 'My Site')
      .replace('{{content}}', content);
    
    const outputPath = path.join('build', file.replace('.md', '.html'));
    fs.writeFileSync(outputPath, pageHtml);
  }
});

// Process blog posts
const postsDir = 'src/content/posts';
const posts = [];

fs.readdirSync(postsDir).forEach(file => {
  if (file.endsWith('.md')) {
    const { metadata, content } = processMarkdown(path.join(postsDir, file));
    const postHtml = template
      .replace('{{title}}', metadata.title || 'Blog Post')
      .replace('{{content}}', content);
    
    const outputPath = path.join('build/blog', file.replace('.md', '.html'));
    fs.ensureDirSync('build/blog');
    fs.writeFileSync(outputPath, postHtml);
    
    posts.push({
      title: metadata.title,
      date: metadata.date,
      slug: file.replace('.md', ''),
      excerpt: metadata.excerpt || ''
    });
  }
});

// Generate blog index
const blogIndexContent = `
  <h1>Blog Posts</h1>
  <div class="blog-list">
    ${posts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(post => `
        <article class="blog-preview">
          <h2><a href="/blog/${post.slug}.html">${post.title}</a></h2>
          <time>${new Date(post.date).toLocaleDateString()}</time>
          <p>${post.excerpt}</p>
        </article>
      `)
      .join('')}
  </div>
`;

const blogIndexHtml = template
  .replace('{{title}}', 'Blog')
  .replace('{{content}}', blogIndexContent);

fs.writeFileSync('build/blog/index.html', blogIndexHtml);

console.log('Build completed successfully!'); 