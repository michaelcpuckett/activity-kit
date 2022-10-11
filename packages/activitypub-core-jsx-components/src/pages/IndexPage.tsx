import React from 'react';

export const IndexPage = () => (
  <html>
    <head>
      <link rel="stylesheet" href="index.css" />
    </head>
    <body>
      <main>
        <form id="signup" action="/user">
          <label>
            <span>Email</span>
            <input required type="text" name="email" />
          </label>
          <label>
            <span>Password</span>
            <input required type="password" name="password" />
          </label>
          <label>
            <span>Name</span>
            <input required type="text" name="name" />
          </label>
          <label>
            <span>Username</span>
            <input required type="text" name="preferredUsername" />
          </label>
          <button type="submit">
            Sign Up
          </button>
        </form>
      </main>
      <script type="module" src="index.js"></script>
    </body>
  </html>
)