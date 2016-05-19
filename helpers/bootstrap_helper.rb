module BootstrapHelper
  def fa(icon, options = {})
    classes = "fa fa-#{icon.to_s.dasherize} #{options.delete(:class)}"

    content_tag :i, '', { class: classes }.merge(options)
  end
end
