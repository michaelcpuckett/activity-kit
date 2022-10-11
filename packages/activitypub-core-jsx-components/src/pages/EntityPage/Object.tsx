import { AP } from 'activitypub-core-types/src';
import { NoteEntity } from './Note';
import React from 'react';

export function ObjectEntity({ object }: { object: AP.ExtendedObject }) {
  if (object.type === AP.ExtendedObjectTypes.NOTE) {
    return <NoteEntity note={object}></NoteEntity>;
  }

  return <div className="card">
    <h1>
      <>
        A {object.type}
      </>
    </h1>
  </div>;
}