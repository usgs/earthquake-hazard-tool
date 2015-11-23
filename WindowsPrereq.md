Windows Prerequisites
=====================

### Dependencies
There are multiple dependencies that must be installed for this project:

1. Git Bash or Cygwin (Git Bash was used for this installation)
1. Node
1. PostgreSQL
1. PHP
1. Visual C++

#### Install Git Bash
1. You will need a terminal tool for Windows. Git Bash
   (http://git-scm.com/download/win) was used to test these steps, but Cygwin
   (http://cygwin.com/install.html) or another unix-like editor should work too.

#### Install Node
1. Install the latest release of Node (http://nodejs.org/) for Windows, using
   the Windows Installer (.msi). Defaults should be sufficient for this.

#### Install PostgreSQL
1. Install PostgreSQL version 9.2.14 (http://www.postgresql.org/).
1. Open admin command prompt and stop postgreSQL server.
```
$ cd C:\Program Files\postgresSQL\9.2f
$ bin\pg_ctl -D data stop
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
#### Install Visual C++
1. If you see an error message for a missing MSVCR110.dll file install Visual C++
```
https://support.microsoft.com/en-us/kb/2977003
```
