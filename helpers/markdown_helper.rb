module MarkdownHelper
  def markdown(text)
    Tilt['markdown'].new { text }.render
  end
end
