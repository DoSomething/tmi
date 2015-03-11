# config/deploy.rb file
require 'bundler/capistrano'

set :application, "tmi"
set :deploy_to, ENV["DEPLOY_PATH"]
server  ENV["SERVER_NAME"], :app, :web

gateway = ENV["GATEWAY"]
unless gateway.nil?
  set :gateway, ENV["GATEWAY"]
end

set :user, "dosomething"
set :group, "dosomething"
set :use_sudo, false

set :repository, "."
set :scm, :none
set :deploy_via, :copy
set :keep_releases, 1

ssh_options[:keys] = [ENV["CAP_PRIVATE_KEY"]]

default_run_options[:shell] = '/bin/bash'

