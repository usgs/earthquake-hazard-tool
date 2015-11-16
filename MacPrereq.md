Mac / OS X Prerequisites
========================

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
$ sudo npm install -g grunt-cli
```

#### Install PHP
```
$ brew install php55
$ brew install php55-pdo-pgsql
```

#### Install PostgreSQL
This will take you through the process of installing, starting, and creating a
PostgreSQL database locally.

1. Install

  ```
  $ brew install postgresql
  ```
  After running `brew install postgresql`, the terminal will output directions
  that you will use to get your installation up and running.

1. Create/Upgrade a Database

  If this is your first install, create a database with:
  ```
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
