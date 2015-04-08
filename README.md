earthquake-hazard-tool
==============

Unified application for hazard calculations.

[License](License.md)

## Getting Started
On OS X, we recommend using `homebrew` to install application dependencies.

### Dependencies
There are multiple dependencies that must be installed for this project:

1. PHP
1. PostgreSQL
1. NPM Dependencies (development only)
1. Sass and Compass (development only)

#### Install PHP
```
brew install php55
```

#### Install PostgreSQL
This will take you through the process of installing, starting, and creating a
PostgreSQL database locally.

1. Install

  ```
  brew install postgresql
  ```
  After running `brew install postgresql`, the terminal will output directions
  that you will use to get your installation up and running.

1. Create/Upgrade a Database

  If this is your first install, create a database with:
  ```
  initdb \
    --auth=md5 \
    --auth-host=md5 \
    --auth-local=md5 \
    --pgdata=<db_directory> \
    --encoding=UTF8 \
    --locale=en_US.UTF-8 \
    --username=<db_admin_username>
    --pwprompt
  ```
  You will need to replace the `<db_directory>` and `<db_admin_username>` with
  actual values that make sense for your environment. The `<db_directory>` is
  a fully-qualified path name to a directory. This directory is where data
  files for the database installation will be located. The
  `<db_admin_username>` is the name of the administrator for the database
  installation. This command will prompt you to enter a password for the
  `<db_admin_username>`.

  > Note: We suggest defining a `.tmp` directory at the root level of this
  > application for the `<db_directory>`.

1. Start/Stop PostgreSQL

  After running the `initdb` command, you should see a success message. Use the
  `pg_ctl` utility to start the database.

  ```
  pg_ctl -D <db_directory> start
  ```

  You will need to replace the `<db_directory>` with the same value you used
  when running the `initdb` command (above). Alternatively, you can set the
  `PGDATA` environment variable to this value and you will not need to specify
  the `-D <db_directory>` flag.

1. Login

  Login to the default `postgres` database with the user that created the
  database.

  ```
  psql postgres
  ```

  > Note: PostgreSQL will create the default database `postgres`, which  you
  > can access with the same user that you used to create the database.


#### Install NPM Dependencies

From the root of the project directory:

```
npm install
```

#### Install Sass and Compass with Ruby

```
gem install sass
gem install compass
```

### Preview in a Browser

```
grunt
```

## Having trouble getting started?

If this is your first time using **grunt**, you need to install the grunt
command line interface globally.

```
npm install -g grunt-cli
```
