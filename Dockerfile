# Simple Dockerfile for serving pre-built Jekyll site with Caddy
FROM caddy:2.7-alpine

# Install security updates
RUN apk upgrade --no-cache \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S caddy-user \
    && adduser -S -D -H -u 1001 -h /var/lib/caddy -s /sbin/nologin -G caddy-user caddy-user

# Copy the pre-built static site
COPY --chown=caddy-user:caddy-user _site/ /usr/share/caddy/

# Copy Caddyfile configuration
COPY --chown=caddy-user:caddy-user Caddyfile /etc/caddy/Caddyfile

# Create directories for logs and data
RUN mkdir -p /var/log/caddy /data /config \
    && chown -R caddy-user:caddy-user /var/log/caddy /data /config /usr/share/caddy

# Expose ports
EXPOSE 80 443

# Use non-root user
USER caddy-user

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Caddy will automatically start with the default entrypoint