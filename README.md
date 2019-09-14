# Employee Directory

Add, edit, or view employees information stored in PostgreSQL. The application supports, authentication, management state information, sessions, and a basic web layout that works as a management dashboard.

This project started in college as a requirement for WEB322, later enhanced with security and other improvements.

## Demo

https://employee-directoryhv.herokuapp.com/

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

> Docker and a text editor.

- Pull or clone the repo
- Run the commands in the next section
- Done!


### Build and Run Container
```
docker-compose up --build
```
### Stop Container
```
docker-compose stop
```

## Deployment

```
  heroku login
  heroku create [name]
  git push heroku master
```

## Built With

* [node.js](https://nodejs.org/en/) - Runtime Environment
* [Docker](http://www.dropwizard.io/1.0.2/docs/) - Development Environment
* [Express](https://expressjs.com/) - The web framework used
* [client-sessions](https://github.com/mozilla/node-client-sessions) - Used to manage user sessions


## Authors

**Henry Valbuena**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
