import { AP } from 'activitypub-core-types';
import { NoteEntity } from './Note';
import React from 'react';

export function ObjectEntity({ object, headingLevel }: { object: AP.ExtendedObject; headingLevel: number; }) {
  if (object.type === AP.ExtendedObjectTypes.NOTE) {
    return <NoteEntity headingLevel={headingLevel} note={object}></NoteEntity>;
  }

  return <div className="card">
    <span role="heading" aria-level={headingLevel}>
      A {object.type}
    </span>
  </div>;
}