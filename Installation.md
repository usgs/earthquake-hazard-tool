Installation Page
=============

### Install / Setup Prerequisites
[Mac / OS X Prerequisites](MacPrereq.md)

[Windows Prerequisites](WindowsPrereq.md)

### Clone the project
1. Use git to clone the project from GitHub repository (if you haven't already).
```
$ git clone <clone URL>
```

### Start Database
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
  $ psql -U <db_admin_username> postgres
  ```

  > Note: PostgreSQL will create the default database `postgres`, which  you
  > can access with the same user that you used to create the database.


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
$ psql -U <db_admin_username> postgres

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

  > Note: You will need to replace any value contained in angle brackets (eg.
  > `<db_name>`) with the actual value that makes sense in your environment. You
  > will need to use most of these same values again during the `pre-install`
  > script that gets run (below).

### Install NPM Dependencies
From the root of the project directory.
```
$ npm install
```
If an error occurred try running npm install again.

### Windows only Edit PHP File
1. Edit earthquake-hazard-tool/node_modules/hazdev-template/dist/conf/php.ini
  1. extension_dir = “`<Path to php dir>`\ext\”
  2. extension=php_pdo_pgsql.dll

### Run Pre-Install
1. Run pre-install Setup
Mac / OS X
```
$ src/lib/pre-install
```
Windows:
```
$ php src/lib/pre-install.php
```
1. Option 'Url path to application'
```
$ /hazardtool
```
1. Option 'Comma-separated list of web services to configure'
```
$ staticcurve
```
1. Option 'Meta URL'
```
$ hazws/staticcurve/1
```

  > The `pre-install` script will prompt you for several configuration values.
  > Values related to the database should match those that were used during the
  > "Create Database" step (above).

### Preview in a Browser
```
$ grunt
```
