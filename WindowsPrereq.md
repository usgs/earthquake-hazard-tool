Windows Prerequisites
=====================

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
1. Open admin command promp and stop postgresSQL server.
```
cd C:\Program Files\postgresSQL\
bin\pg_ctl -D data stop
```

#### Install/Setup PHP
1. Install PHP, from zip.
  1. Download the appropriate zip file from http://windows.php.net/download/
  1. Unzip the folder and copy the content into a new folder on your C:\ drive.
  1. Open a terminal window
    ```
    $ cd
    $ vi .bash_profile
    ```
  1. add to this file.
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

  1. Rename file in php dir from php.ini-development to php.ini and Edit this
     file by uncommenting these lines.
      1. extension_dir = “`<PHP_directory>`/ext”
      1. extension=php_pdo_pqsql.dll
      1. extension=php_curl.dll
      1. extension=php_pdo_mysql.dll
      1. extension=php_pdo_sqlite.dll

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

1. Start/Stop PostgreSQL
  1. After running the initdb command, you should see a success message. Use
     the pg_ctl utility to start the database.
     ```
     $ pg_ctl -D <db_directory> start
     ```
1. Login
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
