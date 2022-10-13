import React from 'react';

export const IndexPage = ({ }) => (
  <html>
    <head>
      <link rel="stylesheet" href="index.css" />
    </head>
    <main>
      <form id="signup" action="/user" noValidate>
        <label>
          <span>Email</span>
          <input type="email" name="email" required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" name="password" required />
        </label>
        <label>
          <span>Name</span>
          <input type="text" name="name" required />
        </label>
        <label>
          <span>Username</span>
          <input type="text" name="preferredUsername" required />
        </label>
        <button type="submit">
          Submit
        </button>
      </form>
      <script type="module" src="index.js"></script>
    </main>
  </html>
)