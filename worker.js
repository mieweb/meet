export default {
  async fetch(request, env, ctx) {
    try {
      // Parse the request URL
      const url = new URL(request.url);
      // Get the path (e.g., '/username') and remove the leading slash
      const key = url.pathname.substring(1);

      // Get the host (e.g., 'meet.domain.com')
      const host = url.hostname;

      // If the key is empty, redirect to 'domain.com' (remove subdomain)
      if (!key) {
        // Split the hostname into parts
        const domainParts = host.split('.');
        // Check if there's a subdomain
        if (domainParts.length > 2) {
          // Remove the first element (subdomain)
          domainParts.shift();
          // Reconstruct the hostname without the subdomain
          const newHost = domainParts.join('.');
          // Redirect to the new URL without the subdomain
          return Response.redirect(`${url.protocol}//${newHost}`, 302);
        } else {
          // Already at the main domain, no subdomain to remove
          return Response.redirect(`${url.protocol}//${host}`, 302);
        }
      }

      // Fetch the JSON data from the specified URL
      const dataResponse = await fetch(
        'https://mie.webchartnow.com/webchart.cgi?f=layoutnouser&&name=conferencelist&raw=1&json'
      );

      // Check if the fetch was successful
      if (!dataResponse.ok) {
        // Return a 500 error if the data fetch failed
        return new Response('Error fetching data', { status: 500 });
      }

      // Parse the fetched JSON data
      let data;
      try {
        data = await dataResponse.json();
      } catch (e) {
        return new Response('Error parsing data', { status: 500 });
      }

      // Look up the key in the JSON data
      if (data[key]) {
        const targetUrl = data[key];
        // Return a 302 redirect to the target URL
        return Response.redirect(targetUrl, 302);
      } else {
        // Return a 404 error with HTML content
        const notFoundHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Meet Not Found</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              h1 { color: #333; }
              p { font-size: 18px; }
              a { color: #0066cc; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <h1>Meet Not Found</h1>
            <p>If you're and MIE employee trying to set up a meet URL, <a href="https://docs.google.com/document/d/1wKkzSFmSnH29boLEJsXgPf3QkOoqZqvwGDSIT9tUi8I/edit?usp=sharing">click here</a>.</p>
          </body>
          </html>
        `;
        return new Response(notFoundHtml, {
          status: 404,
          headers: { 'Content-Type': 'text/html' },
        });
      }
    } catch (err) {
      // Return a 500 error if an exception occurred
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
