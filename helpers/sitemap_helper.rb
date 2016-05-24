module SitemapHelper
  def sitemap_pages
    sitemap.resources.find_all { |resource| resource.content_type =~ /text\/html/ }
  end

  def last_modified(page)
    File.mtime(page.source_file)
  end
end
