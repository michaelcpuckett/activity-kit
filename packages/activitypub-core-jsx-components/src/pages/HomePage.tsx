import React from 'react';
import { AP } from 'activitypub-core/src/types';

export const HomePage = ({ actor }: { actor: AP.Actor }) => (
  <html>
    <body>
      <main>
        Hello <a href={actor.id?.toString()}>{actor.preferredUsername}</a>!
      </main>
    </body>
  </html>
);