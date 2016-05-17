# General configuration parameters
config[:domain]                  = 'rubyonrails.co.uk'
config[:hostname]                = "www.#{config[:domain]}"
config[:url]                     = "https://#{config[:hostname]}"
config[:email_address]           = "hello@#{config[:domain]}"
config[:cloudfront_distribution] = 'ECH0LZH3EE850'

# UTM-related bits
config[:default_utm_source] = config[:hostname]
config[:default_utm_medium] = 'website'
config[:default_utm_campaign] = 'Other Projects'

set :markdown_engine, :redcarpet

# Pages with no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# General configuration
activate :directory_indexes
activate :asset_hash
activate :gzip
activate :automatic_image_sizes

activate :s3_sync do |s3|
  s3.bucket                = config[:hostname]
  s3.aws_access_key_id     = ENV['AWS_ACCESS_KEY_ID']
  s3.aws_secret_access_key = ENV['AWS_SECRET_ACCESS_KEY']
end

activate :cloudfront do |cf|
  cf.access_key_id     = ENV['AWS_ACCESS_KEY_ID']
  cf.secret_access_key = ENV['AWS_SECRET_ACCESS_KEY']
  cf.distribution_id   = config[:cloudfront_distribution]
  cf.filter            = /\.(html|xml|txt)$/
end

# Set cache-control headers to revalidate pages, but everything else is
# asset-hashed, so can live forever.
caching_policy 'text/html',       max_age: 0, must_revalidate: true
caching_policy 'application/xml', max_age: 0, must_revalidate: true
caching_policy 'text/plain',      max_age: 0, must_revalidate: true

default_caching_policy max_age: (60 * 60 * 24 * 365)

activate :external_pipeline,
  name: :gulp,
  command: "./node_modules/gulp/bin/gulp.js #{build? ? 'build' : 'serve'}",
  source: 'intermediate/'

# Build-specific configuration
configure :build do
  activate :minify_html
end
