function extractLinks(markdownContent) {

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(markdownContent)) !== null) {
    const text = match[1];
    const href = match[2];
    const link = `[${text}](${href})`;
    links.push(link);
  }

  return links;
}

module.exports = extractLinks;
