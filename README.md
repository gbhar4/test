# dt - TCP front-end Application

#### Repo: **[https://bitbucket.org/frontenddevteam/dt](https://bitbucket.org/frontenddevteam/dt)**

---

## Local dev environment setup
### Pre-requisite installs
* **Git** (latest version) - [https://git-scm.com/book/en/v2/Getting-Started-Installing-Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* **NodeJS** (latest LTS version) - [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

### Project Installation
* Clone project repo:
```bash
git clone git@bitbucket.org:frontenddevteam/dt.git
```
* Install dependancies:
```bash
npm install
```
### Application Bootstrap
* Run Local Static Client Code with Mock APIs -
```bash
npm run static
```
* Run Local Static Client Code with Live APIs -
```bash
npm run int
```
* Run Local Node Server -
```bash
npm run node
```

* Enable reverse proxy:
domainMapping.js
  apiDomain: '://localhost:50109/api/'
express.js:
  add the following right after the imports (has to be there, more info online)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
configure charles proxy for reverse proxy

## Process
For version control, Git. Branches should use the following naming convention:

    <type>/<user>/DT-<ticket-number>

For example:

    feature/citro/DT-123
    bugfix/citro/DT-456

### Commit Messages
When creating commit messages, include the JIRA ticket
number (or numbers) of the task associated with your changes.

    DT-567: Styled header navigation

The first line of your commit message should be a short
summary of what you changed. Lines after that can be used
to expound on your changes and explain details or decisions.

### Pull Requests
Pull requests should include the JIRA task associated with
the committed changes. Include the user story associated
with the tasks in the pull request content as well. If
this closes the user story (completes all tasks or the last
task), include the text `Closes TCPM-<user-story#>`.

Also include an animated gif or screenshot that showcases
the functionality that you changed, added or fixed. If you
are not including a visual, explain why. For example, you
may exclude a visual from your PR if the changes are purely
in the logical part of the app.

#### Disabling same origin policy in Chrome

Launch Chrome from the terminal like so (OSX):
```
open -a Google\ Chrome --args --disable-web-security --user-data-dir
```
Be careful using this method and use it only for development, as having
the same origin policy totally disabled leaves you vulnerable to
malicious scripts.

---

### Unit test and coverage report

We are using mocha, chai, sinon to unit test the client side and server side javascript code.

* Run unit test
```bash
npm test
```
* Run the code coverage on the terminal
```bash
npm test:cover
```
* Run the code coverage on the terminal as well as generating the HTML version
```bash
npm test:cover:html
```
* Run the code coverage on the terminal as well as generating lcov report
```bash
npm test:cover:report
```

For more, visit the project **[Confluence wiki page](https://childrensplace.atlassian.net/wiki/display/DT/Front-end+Documentation)**.
