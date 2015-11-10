earthquake-hazard-tool
==============

Unified application for hazard calculations.

[License](License.md)

## Getting Started
On OS X, we recommend using `homebrew` to install application dependencies.

### Dependencies
There are multiple dependencies that must be installed for this project:

1. Xcode
1. HomeBrew
1. Node
1. Grunt
1. PHP
1. PostgreSQL

#### Install Xcode
```
https://developer.apple.com/xcode/
```

#### Install HomeBrew
```
http://mxcl.github.io/homebrew/
```

#### Install Node and NPM
1. nodejs.org
1. Download v4.2.2
1. Update paths as needed in your ~/.bash_profile: (If you use a tool other
   than brew to install these dependencies, you may need to modify these paths
   to point to the install directories.)
```
# brew installed binaries
export PATH=$PATH:/usr/local/bin
# npm installed binaries
export PATH=$PATH:/usr/local/share/npm/bin
```

#### Install Grunt
```
sudo npm install -g grunt-cli
```

#### Install PHP
```bash
$ brew install php55
$ brew install php55-pdo-pgsql
```

#### Clone the project
1. Use git to clone the project from GitHub repository (if you haven't already).
```
git clone <clone URL>
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
  $ psql -U <db_admin_username> postgres
  ```

  > Note: PostgreSQL will create the default database `postgres`, which  you
  > can access with the same user that you used to create the database.

#### Create Database

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

#### Install NPM Dependencies
From the root of the project directory.
If an error occurred try running npm install again.
```bash
$ npm install
```

#### Preview in a Browser

```bash
$ ./src/lib/pre-install
$ grunt
```

  > The `pre-install` script will prompt you for several configuration values.
  > Values related to the database should match those that were used during the
  > "Create Database" step (above).

## Windows Installation

### Dependencies
There are multiple dependencies that must be installed for this project:

1. Git Bash or Cygwin (Git Bash was used for this installation)
1. Node
1. PostgreSQL
1. PHP
1. Grunt

#### Install Git Bash
1. You will need a terminal tool for Windows. Git Bash
   (http://git-scm.com/download/win) was used to test these steps, but Cygwin
   (http://cygwin.com/install.html) or another unix-like editor should work too.

#### Install Node
1. Install the latest release of Node (http://nodejs.org/) for Windows, using
   the Windows Installer (.msi). Defaults should be sufficient for this.

#### Install PostgreSQL
1. Install PostgreSQL version 9.2.14 (http://www.postgresql.org/).
2. Open admin command promp and stop postgresSQL server.
  ```
  cd C:\Program Files\postgresSQL\
  bin\pg_ctl -D data stop
  ```

#### Install/Setup PHP
1. Install PHP, from zip.
  1. Download the appropriate zip file from http://windows.php.net/download/
  2. Unzip the folder and copy the content into a new folder on your C:\ drive.
  3. Open a terminal window
    ```
    $ cd
    $ vi .bash_profile
    ```
  4. add to this file.
    ```
    export PATH=$PATH:<PHP_directory>
    export PATH=$PATH:<node_directory>
    export PATH=$PATH:<PostgreSQL_directory>
    ```

    You will need to replace the `<PHP_directory>`, `<node_directory>` and
    `<PostgreSQL_directory>` with the correct path to each.

    Example:
    ```
    export PATH=$PATH:/c/php-5.6
    export PAtH=$PATH:/c/Program\ Files/nodejs
    export PATH=$PATH:/c/Program\ Files/PostgreSQL/9.2/bin
    ```

  5. Rename file in php dir from php.ini-development to php.ini and Edit this
     file by uncommenting these lines.
      1. extension_dir = “`<PHP_directory>`/ext”
      2. extension=php_pdo_pqsql.dll
      3. extension=php_curl.dll
      4. extension=php_pdo_mysql.dll
      5. extension=php_pdo_sqlite.dll

#### Clone the project
1. Use git to clone the project from GitHub repository (if you haven't already).

#### Setup Database
1. If this is your first install, create a database with:
  ```
  $ initdb \
  $ --pgdata=<db_directory> \
  $ --encoding=UTF8 \
  $ --username=<db_admin_username>
  ```
  You will need to replace the `<db_directory>` and `<db_admin_username>` with
  actual values that make sense for your environment. The `<db_directory>` is a
  fully-qualified path name to a directory. This directory is where data files
  for the database installation will be located. The <db_admin_username> is the
  name of the administrator for the database installation. This command will
  prompt you to enter a password for the `<db_admin_username>`.

  Note: We suggest defining a .data directory at the root level of this
  application for the `<db_directory>`.

2. Start/Stop PostgreSQL
  1. After running the initdb command, you should see a success message. Use
     the pg_ctl utility to start the database.
     ```
     $ pg_ctl -D <db_directory> start
     ```
3. Login
  1. Login to the default postgres database with the user that created the
     database.
     ```
     $ psql -U <db_admin_username> postgres
     ```

     Note: PostgreSQL will create the default database postgres, which you can
     access with the same user that you used to create the database.

#### Install Grunt
1. Use npm to install grunt
  ```
  $ npm install -g grunt-cli
  ```

#### NPM install
From the root of the project directory.
If an error occurred try running npm install again.
```
$ npm install
```

#### Create Database

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

  > Note: You will need to replace any value contained in angle brackes (eg.
  > `<db_name>`) with the actual value that makes sense in your environment. You
  > will need to use most of these same values again during the `pre-install`
  > script that gets run (below).


#### Edit PHP File
1. Edit earthquake-hazard-tool/node_modules/hazdev-template/dist/conf/php.ini
  1. extension_dir = “`<Path to php dir>`\ext\”
  2. extension=php_pdo_pgsql.dll

#### Run Pre-Install
1. Run pre-install setup
```
php src/lib/pre-install.php
```
2. For option 'Comma-separated list of web services to configure'
```
staticcurve
```
3. For option 'Meta URL'
```
hazws/staticcurve/1
```

#### Run Grunt
```
$ grunt
```
