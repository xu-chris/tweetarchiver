# tweetarchiver

An archiver for tweets. Useful for media agencies and enthusiastic journalists.

## Docker Compose

Run it as docker container.

Example:
```yaml
---
version: "3.7"

services:
  tweetarchiver:
    image: ghcr.io/xu-chris/tweetarchiver/tweetarchiver:latest
    container_name: tweetarchiver
    volumes:
      - ./archive/:/app/archive/
      - ./db/:/app/db/
    restart: unless-stopped
    network_mode: host
    environment:
      BOT_TOKEN: "YOUR_TOKEN"
      PUID: 100
      PGID: 100
```
