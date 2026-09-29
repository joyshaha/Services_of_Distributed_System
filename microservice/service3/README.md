# Micro-Service Architecture:
### Service 3 Go
(mise is the modern best practice for Go language development. While goenv was historically popular)

* Run locally with mise

```
Install uv:
- brew install mise
- echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
- source ~/.zshrc
- mise --version

Start project:
- mise use go@1.25
- go version

Clone project:
- mise install
- go mod download

Add packages:
- go mod init service3
- go get <package>
- go mod tidy

Run mode:
- go run .

Or Build and run locally
- go build -o server .
- ./server
- rm server  # remove the binary when finished


```


* Run locally with go/goenv (goenv is lagacy nowadays)

```
Install go/goenv:
- brew update
- brew install go 
- brew install goenv  # for multiple version choice

Check version:
- go version
- goenv ls-remote  # for multiple version choice

Fix installtion with goenv:
- goenv install 1.25.0
- goenv global 1.25.0

Start project:
- cd ~/<project directiory>
- go mod init service3

- goenv local 1.25.0  # lagacy now; If a specific project requires an older or newer Go version, step inside its directory and declare a local version(This creates a .go-version file in the folder. Whenever you cd into this directory, your terminal will automatically switch to Go 1.22.0)

Install external dependencies:
- go get <package> ;  # package=github.com/gin-gonic/gin

Clean up dependency:
- go mod tidy

Run mode:
- go run .

Or 
- go run main.go

Or make executable and run
- go build -o server .
- ./server

```

* Run with docker

```
Using makefile:
- make all
- make docker_run

Or(if want same network with FQDN facilities)
- make docker_network_run

End/wrap:
- make docker_rm
```