# Dealer Portal

Staging: https://dealer2.staging.speedleasing.com/home

## Installation

1. Install NodeJs
2. Install Yarn
3. Run `yarn Install`
4. Install Docker
5. Run `docker-compose build`
6. Run `docker-compose up`

## Possible issue

If installation of new Library will not reflect on docker

1. run `docker-compose down -v` to clear the volume
2. run `docker-compose build`

Alternatively if problem still occures you can manually run `yarn start`
