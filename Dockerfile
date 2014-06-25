FROM ubuntu:14.04
MAINTAINER Olivier Philippon <olivier@rougemine.com>

# let's install "whois" first, for its "mkpasswd" tool
RUN apt-get install -y whois

# All right, now we can create a "dev-user" Linux user
# (as this is a development Docker container, we prefer that to the default Docker "naked" root user :-)
ENV USER_LOGIN dev-user
ENV BASHRC "/home/$USER_LOGIN/.bashrc"
RUN useradd -m -p `mkpasswd docker` $USER_LOGIN
RUN chsh -s /bin/bash $USER_LOGIN
RUN su - $USER_LOGIN -c "touch /home/$USER_LOGIN/.bashrc"

# May be useful for Debian installs
ENV DEBIAN_FRONTEND noninteractive

# Sources update
RUN apt-get -qq update

# Misc utils, always useful...
RUN apt-get install -qq -y git curl wget vim openssh-server apt-utils sudo

# Our dev user is a sudoer
RUN usermod -a -G sudo $USER_LOGIN

# Nginx & Passenger install
# @see https://www.phusionpassenger.com/documentation/Users%20guide%20Nginx.html#install_on_debian_ubuntu
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 561F9B9CAC40B2F7
RUN apt-get install -qq -y apt-transport-https ca-certificates
RUN sh -c 'echo "deb https://oss-binaries.phusionpassenger.com/apt/passenger trusty main" >> /etc/apt/sources.list.d/passenger.list'
RUN chown root: /etc/apt/sources.list.d/passenger.list
RUN chmod 600 /etc/apt/sources.list.d/passenger.list
RUN apt-get -qq update
RUN apt-get install -qq -y nginx-extras passenger

# App VirtualHost setup
RUN sh -c 'echo "server {\n \
    root /host/public;\n \
    passenger_enabled on;\n \
    passenger_nodejs /home/dev-user/.nvm/v0.10.29/bin/node;\n \
    passenger_app_env development;\n \
    passenger_app_type node;\n \
    passenger_startup_file server.js;\n \
}\n \
" >> /etc/nginx/sites-available/nodejs-site'
# Ngninx default VHost is disabled
RUN rm /etc/nginx/sites-enabled/default
# Node.js VHost is enabled
RUN ln -s /etc/nginx/sites-available/nodejs-site /etc/nginx/sites-enabled/nodejs-site

# MySQL install
RUN apt-get install -qq -y mysql-server

# Node.js stuff
RUN su - $USER_LOGIN -c "git clone https://github.com/creationix/nvm.git /home/$USER_LOGIN/.nvm"
RUN su - $USER_LOGIN -c "echo '[ -s /home/$USER_LOGIN/.nvm/nvm.sh ] && . /home/$USER_LOGIN/.nvm/nvm.sh # This loads NVM' >> $BASHRC"
RUN su - $USER_LOGIN -c "source /home/$USER_LOGIN/.nvm/nvm.sh && nvm install 0.10.29"
RUN su - $USER_LOGIN -c "source /home/$USER_LOGIN/.nvm/nvm.sh && nvm alias default 0.10.29"
RUN su - $USER_LOGIN -c "source /home/$USER_LOGIN/.nvm/nvm.sh && npm update -g npm"
RUN su - $USER_LOGIN -c "source /home/$USER_LOGIN/.nvm/nvm.sh && npm install -g grunt-cli gulp bower express-generator"

ENV QUOTE "'"
# General .bashrc additions
RUN su - $USER_LOGIN -c "echo 'force_color_prompt=yes' >> $BASHRC"
RUN su - $USER_LOGIN -c "echo 'alias ls=${QUOTE}ls --color=auto${QUOTE}' >> $BASHRC"
RUN su - $USER_LOGIN -c "echo 'alias ll=${QUOTE}ls -Al${QUOTE}' >> $BASHRC"

# Webmin install
RUN wget -nv http://prdownloads.sourceforge.net/webadmin/webmin_1.690_all.deb
RUN dpkg -i webmin_1.690_all.deb || true
RUN apt-get install -y -f
RUN rm webmin_*

# Exposed ports
EXPOSE  80
EXPOSE 3306
EXPOSE 10000

# Start our services and log in as the dev user
ENTRYPOINT service nginx start && service mysql start && service webmin start && su - $USER_LOGIN


# How to use this image:
# Once:
# docker build -t rougemine/grand-tetras-js-ubuntu .
# Then, each time you want to use this image :
# docker run -i -t -p 2222:22 -p 3307:3306 -p 8080:80 -p 8888:8080 -p 10010:10000 -v $PWD:/host rougemine/grand-tetras-js-ubuntu /bin/bash
# Commit container changes to its repository:
# docker ps
# docker commit <container_id> rougemine/grand-tetras-js-ubuntu
 

