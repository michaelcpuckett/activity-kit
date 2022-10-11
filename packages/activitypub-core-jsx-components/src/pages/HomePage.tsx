import React from 'react';
import { AP } from 'activitypub-core-types/src';

export const HomePage = ({ actor }: { actor: AP.Actor }) => (
  <html>
    <body>
      <main>
        Hello <a href={actor.id?.toString()}>{actor.preferredUsername}</a>!
      </main>
    </body>
  </html>
);