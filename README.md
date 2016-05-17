# UK Ruby on Rails Consulting

[![Build Status](https://travis-ci.org/wossname/www.rubyonrails.co.uk.svg?branch=master)](https://travis-ci.org/wossname/www.rubyonrails.co.uk)

I've put together a wee static web site for <https://www.rubyonrails.co.uk/> as
I've owned the domain name for ~7 years now and haven't gotten around to doing
anything with it. I thought I might as well use it to try and pimp my
professional services. ;-) It's a [Middleman](http://middlemanapp.com/) static
site, deployed to [Amazon S3](https://aws.amazon.com/s3/) and served from
[CloudFront](https://aws.amazon.com/cloudfront/).

It's using Middleman's external asset pipeline, which is delegating the role of
building assets to [gulp](http://gulpjs.com/) which, in turn, is assembling CSS
& JavaScript from various upstream [bower](http://bower.io/) components. I seem
to have hit the sweet spot (for me) between it being easy to manage content,
while being nice and efficiently deployed to production.

Speaking of deploying to production, I've got Travis CI on the case:
[wossname/www.rubyonrails.co.uk](https://travis-ci.org/wossname/www.rubyonrails.co.uk)
which will build the site and, if it's successful (and on the master branch),
automatically deploy to production. That means I can make changes to the site
from my iPad, using something like [Working Copy](https://geo.itunes.apple.com/gb/app/working-copy-powerful-git/id896694807?mt=8&uo=4&at=1010lbgm&ct=github),
and have the changes show up on the site a few minutes later.

I should write this into a blog post, but meanwhile, you should check out the
site and hire my l33t skills. ;-)

## Notes on Doing Stuff

Best place to start is to install all the dependencies (of which there are
many, in three different packaging systems!). If you've already got `rake`
kicking around, you can install them all with:

    rake deps

If you haven't, it's probably easiest to `gem install rake` first. ;-) It
assumes you've already got a working Ruby installation, and a working NodeJS
installation with npm.

To run the Middleman server locally, I've wrapped it with
[foreman](http://ddollar.github.io/foreman/) because that's how I roll. You can
start the server up with:

    foreman start

and it'll be available on <http://localhost:5000/>. If you want to just build
the static site itself, you can run:

    rake build

and it will stick the output in the `build/` folder, ready to be deployed.

To deploy the site, build it first, then run:

    rake deploy

and it'll sync the contents of the `build/` folder up to S3. It assumes that
you have S3 credentials set in your environment -- the easiest way to do that
is to set environment variables for `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY`. The deploy task *doesn't* depend on the build task,
just because I want them to run as separate parts of the CI build.
Unfortunately, middleman rebuilds the external assets *every* time you launch
it (see [#1916](https://github.com/middleman/middleman/issues/1916)) and
rebuilding them three times on every CI build seemed a bit wasteful.
