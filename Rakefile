task default: :build

task :deps do
  sh 'bundle install'
  sh 'npm install'
  sh 'node_modules/bower/bin/bower install'
end

task :build do
  sh 'bundle exec middleman build'
end

task deploy: :build do
  sh 'bundle exec middleman sync'
  sh 'bundle exec middleman invalidate'
end
