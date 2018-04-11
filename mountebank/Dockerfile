FROM cpoepke/mountebank-basis:latest

# ADD imposters /mb/
# RUN ln -s /usr/bin/nodejs /usr/bin/node

EXPOSE 2525
EXPOSE 8010

CMD mb --configfile /mb/imposters.ejs --allowInjection --allowCORS
