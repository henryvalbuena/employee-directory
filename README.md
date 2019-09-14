# Readme Template

[Template link](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
by [@PurpleBooth](https://github.com/PurpleBooth)

# Employee Directory

Add, edit, or view employees information stored in PostgreSQL. The application supports, authentication, management state information, sessions, and a basic web layout that works as a management dashboard.

This project started in college as a requirement for WEB322, later enhanced with security and other improvements.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Demo

https://employee-directoy.herokuapp.com/

### Prerequisites

Docker and a text editor.

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

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds


## Authors

* **Henry Valbuena*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
