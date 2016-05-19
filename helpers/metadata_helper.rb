module MetadataHelper
  def title_meta
    current_page.data.title || config[:long_title]
  end

  def description_meta
    current_page.data.description || config[:description]
  end

  def category_meta
    current_page.data.category || config[:site_category]
  end

  def tags_meta
    (current_page.data.tags || []) + (config[:site_tags] || [])
  end

  def published_at_meta
    current_page.data.published_at || Time.now
  end

  def updated_at_meta
    current_page.data.updated_at || published_at_meta
  end

  def url_meta
    "#{config[:url]}#{current_page.url}"
  end
end
