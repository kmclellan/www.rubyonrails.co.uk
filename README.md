# UK Ruby on Rails Consulting

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
