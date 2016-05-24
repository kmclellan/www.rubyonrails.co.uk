module BootstrapHelper
  def fa(icon, options = {})
    classes = "fa fa-#{icon.to_s.dasherize} #{options.delete(:class)}"

    content_tag :i, '', { class: classes }.merge(options)
  end

  def body_classes
    classes = case layout = current_page.options[:layout]
              when 'main'
                'top-navigation fixed-nav'
              else
                layout
              end

    [classes, page_classes].compact.join(' ')
  end
end
