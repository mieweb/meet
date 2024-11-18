# Meet URL Redirector

This repository contains a Cloudflare Worker script that supports configuring meet URLs using the DMS (Document Management System) as the source of truth. The worker acts as a dynamic redirector, mapping user-friendly meet URLs to their respective target URLs based on data fetched from the DMS.

MIE employees looking to set up a meet can follow the directions [here](https://docs.google.com/document/d/1wKkzSFmSnH29boLEJsXgPf3QkOoqZqvwGDSIT9tUi8I/edit?usp=sharing).

## Supported Domains

- `meet.bluehive.com`
- `meet.enterprise.health`
- `meet.mieweb.org`
- `meet.webch.art`
- `meet.mieweb.com`

## How the Script Works

### Overview

The Cloudflare Worker script serves as a URL redirector that:

- Fetches a JSON mapping of usernames to meet URLs from the DMS.
- Redirects requests to the corresponding meet URL if the username exists.
- Returns a custom HTML page if the username is not found.
- Redirects to the main domain if accessed without a specific path.

### Request Handling

1. **Parsing the Request**:
   - The script extracts the path and hostname from the incoming request URL.
   - The path (e.g., `/username`) is used as the key to look up in the JSON data.
   - The hostname is used to determine if a subdomain exists.

2. **Root URL Redirection**:
   - If the request path is empty (i.e., `meet.domain.com`), the script checks for a subdomain.
   - If a subdomain exists, it removes it and redirects to the main domain (e.g., `domain.com`).

3. **Fetching JSON Data**:
   - The script fetches JSON data from the DMS URL:
     ```
     https://mie.webchartnow.com/webchart.cgi?f=layoutnouser&&name=conferencelist&raw=1&json
     ```
   - This data contains mappings of usernames to their respective meet URLs.

4. **Redirecting to the Meet URL**:
   - If the username exists in the JSON data, the script performs a 302 redirect to the associated meet URL.

5. **Handling Username Not Found**:
   - If the username is not found, the script returns a custom HTML page informing the user.
   - The HTML includes a message and a link to set up a new meet URL.

### Error Handling

- **Network Errors**: If fetching the JSON data fails, the script returns a 500 Internal Server Error.
- **JSON Parsing Errors**: If the fetched data cannot be parsed as JSON, a 500 error is returned.
- **Unhandled Exceptions**: Any unexpected errors result in a 500 Internal Server Error response.

## Technical Details

### Code Structure

The main logic resides within the `fetch` event handler of the Cloudflare Worker:

```javascript
export default {
  async fetch(request, env, ctx) {
    // Main logic here
  },
};
```
### Performance Optimization TODO

- **Caching**:
  - Implement caching strategies to reduce the number of network requests to the DMS. https://github.com/mieweb/meet/issues/1
  - Use Cloudflare's caching features to store the JSON data for a short duration if the data doesn't change frequently. https://github.com/mieweb/meet/issues/1

## Additional Resources

- **Cloudflare Workers Documentation**:
  - [Getting Started with Cloudflare Workers](https://developers.cloudflare.com/workers/get-started/guide/)
  - [Workers KV for Caching](https://developers.cloudflare.com/kv/api/)
