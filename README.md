earthquake-hazard-tool
==============
[![Build Status](https://travis-ci.org/usgs/earthquake-design-ws.svg?branch=master)](https://travis-ci.org/usgs/earthquake-design-ws)
[![Coverage](https://codecov.io/gh/usgs/earthquake-hazard-tool/branch/master/graph/badge.svg)](https://codecov.io/gh/usgs/earthquake-hazard-tool)

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
```bash
$ brew install php55 --with-postgresql --with-cgi
```

#### Install PostgreSQL
This will take you through the process of installing, starting, and creating a
PostgreSQL database locally.

1. Install

  ```bash
  $ brew install postgresql
  ```
  After running `brew install postgresql`, the terminal will output directions
  that you will use to get your installation up and running.

1. Create/Upgrade a Database

  If this is your first install, create a database with:
  ```bash
  $ initdb \
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

  > Note: We suggest defining a `.data` directory at the root level of this
  > application for the `<db_directory>`.

1. Start/Stop PostgreSQL

  After running the `initdb` command, you should see a success message. Use the
  `pg_ctl` utility to start the database.

  ```bash
  $ pg_ctl -D <db_directory> start
  ```

  You will need to replace the `<db_directory>` with the same value you used
  when running the `initdb` command (above). Alternatively, you can set the
  `PGDATA` environment variable to this value and you will not need to specify
  the `-D <db_directory>` flag.

1. Login

  Login to the default `postgres` database with the user that created the
  database.

  ```bash
  $ psql postgres
  ```

  > Note: PostgreSQL will create the default database `postgres`, which  you
  > can access with the same user that you used to create the database.


#### Install NPM Dependencies

From the root of the project directory:

```bash
$ npm install
```

#### Install Sass and Compass with Ruby

```bash
$ gem install sass
```

### Create Database

When installing this application you will be prompted for a database DSN (host,
port, db name) as well as database username and password.

While the database server is currently running, you still need to create a
database in the server that can be used by the application. We recommend a
dedicated tablespace be assigned to this database. Additionally, for database
access, you will not want to use the database administrator credentials but
rather a dedicated username/password for this application.

```bash
$ mkdir <db_directory>/<db_name>
$ psql postgres

postgres=# CREATE USER <db_user> WITH ENCRYPTED PASSWORD '<db_pass>';
postgres=# CREATE TABLESPACE <db_name>_ts
  OWNER <db_user>
  LOCATION '<db_directory>/<db_name>';
postgres=# CREATE DATABASE <db_name>
  WITH OWNER <db_user>
  TABLESPACE <db_name>_ts;
postgres=# \c <db_name>;
<db_name>=# CREATE SCHEMA <db_schema> AUTHORIZATION <db_user>;
<db_name>=# \q
$
```

  > Note: You will need to replace any value contained in angle brackes (eg.
  > `<db_name>`) with the actual value that makes sense in your environment. You
  > will need to use most of these same values again during the `pre-install`
  > script that gets run (below).

### Preview in a Browser

```bash
$ ./src/lib/pre-install
$ grunt
```

  > The `pre-install` script will prompt you for several configuration values.
  > Values related to the database should match those that were used during the
  > "Create Database" step (above).

## Having trouble getting started?

If this is your first time using **grunt**, you need to install the grunt
command line interface globally.

```bash
$ npm install -g grunt-cli
```
