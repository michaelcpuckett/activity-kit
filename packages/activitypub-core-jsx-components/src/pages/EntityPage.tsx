import React from 'react';
import { AP } from 'activitypub-core/src/types';

export const EntityPage = ({ entity }: { entity: AP.Entity }) => (
  <html>
    <body>
      <main>
        This is: {entity.name}!
      </main>
    </body>
  </html>
);