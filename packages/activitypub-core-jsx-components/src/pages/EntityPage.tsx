import React from 'react';
import { AP } from 'activitypub-core-types/src';

export const EntityPage = ({ entity }: { entity: AP.Entity }) => (
  <html>
    <body>
      <main>
        This is: {entity.name}!
      </main>
    </body>
  </html>
);