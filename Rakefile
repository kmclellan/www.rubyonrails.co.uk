task default: :build

task :deps do
  bundle :install
  npm    :install
  bower  :install
end

task :build do
  middleman :build
end

task deploy: :build do
  middleman :sync
  middleman :invalidate
end

task :clean do
  gulp :clean
  sh 'rm -rf build'
end

task distclean: :clean do
  gulp :distclean
end

def bundle(command, args = '')
  sh "bundle #{command} #{args}"
end

def middleman(command)
  middleman_args = (verbose == true) ? '--verbose' : ''

  bundle :exec, "middleman #{command} #{middleman_args}"
end

def gulp(task)
  sh "node_modules/gulp/bin/gulp.js #{task}"
end

def bower(command)
  sh "node_modules/bower/bin/bower #{command}"
end

def npm(command)
  sh "npm #{command}"
end
