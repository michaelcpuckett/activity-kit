# [Client to server interactions](https://www.w3.org/TR/activitypub/#client-to-server-interactions)

## `Actor` object's `outbox`

**Status**: Complete.

### Accepts Activity Objects (`outbox:accepts-activities`) *MUST*

**Status**: Complete. Tested.

The Outbox exists as an API endpoint that other servers can POST to.

We check to see if the incoming message is an Activity by looking at the `type`.

### Accepts non-Activity Objects, and converts to Create Activities per 7.1.1 (`outbox:accepts-non-activity-objects`) *MUST*

**Status**: Complete. Tested.

We check to see if the incoming message is an Activity. If not, there is a `wrapInActivity` method that converts it to a `Create` Activity with the
message as its `object`.

### Removes the `bto` and `bcc` properties from Objects before storage and delivery (`outbox:removes-bto-and-bcc`) *MUST*

**Status**: Complete. Needs tests.

There is a `cleanProps` utility function that filters these two properties.

It is included in both `saveEntity.ts` (storage) and `broadcast.ts` (delivery).

### Ignores `id` on submitted objects, and generates a new id instead (`outbox:ignores-id`) *MUST*

**Status**: Complete. Needs a test.

The Outbox generates a unique GUID and overwrites any existing ID.

### Responds with status code 201 Created (`outbox:responds-201-created`) *MUST*

**Status**: Complete. Tested.

The Outbox status code is set to 201 (unless there is an error).

### Response includes Location header whose value is id of new object, unless the Activity is transient (`outbox:location-header`)

**Status**: Complete. Needs a test.

The Outbox Location header is set to the ID of the activity.

The wording is ambiguous here ("new object") but the spec is clear that that the ID should be that of the Activity itself.

## Accepts Uploaded Media in submissions (`outbox:upload-media`) *MUST*

Status: **Not Started**

This will require a new package to handle file storage.

* [ ] Accepts `uploadedMedia` file parameter (`outbox:upload-media:file-parameter`) *MUST*
* [ ] Accepts `uploadedMedia` object parameter (`outbox:upload-media:object-parameter`) *MUST*
* [ ] Responds with status code of 201 Created or 202 Accepted as described in 6. (`outbox:upload-media:201-or-202-status`) *MUST*
* [ ] Response contains a Location header pointing to the to-be-created object's id (`outbox:upload-media:location-header`) *MUST*
* [ ] Appends an `id` property to the new object (`outbox:upload-media:appends-id`) *MUST*
* [ ] After receiving submission with uploaded media, the server should include the upload's new URL in the submitted object's `url` property (`outbox:upload-media:url`) *SHOULD*

## `Update`

**Status**: Complete but not fully tested.

### Server takes care to be sure that the Update is authorized to modify its object before modifying the server's stored copy (`outbox:update:check-authorized`) *MUST*

**Status**: Complete? Not tested.

There is a `isActorAuthorizedToModifyObject` check for this.

### Supports partial updates in client-to-server protocol (but not server-to-server) (`outbox:update:partial`) *NON-NORMATIVE*

**Status**: Complete. Tested.

The final object is composed by taking the old object and then applying the new object's properties on top.

## Server does not trust client submitted content (`outbox:not-trust-submitted`) *SHOULD*

**Status**: Incomplete / Unknown.

## Validate the content they receive to avoid content spoofing attacks (`outbox:validate-content`) *SHOULD*

**Status**: Incomplete / Unknown.

## Take care not to overload other servers with delivery submissions (`outbox:do-not-overload`) *SHOULD*

**Status**: Incomplete / Unknown.

## `Create`

**Status**: Complete. Not tested.

### Merges audience properties (to, bto, cc, bcc, audience) with the Create's object's audience properties (`outbox:create:merges-audience-properties`) *SHOULD*

**Status**: Complete. Not tested?

The `combineAddresses` utility handles this.

### Create's `actor` property is copied to be the value of `.object.attributedTo` (`outbox:create:actor-to-attributed-to`) *SHOULD*

**Status**: Complete. Not tested?

## `Follow`

### Adds followed object to the actor's Following Collection (`outbox:follow:adds-followed-object`) *SHOULD*

**Status**: Complete? Tested?

This is ambiguous/confusing. The follow doesn't actually happen until the Accept activity appears in the inbox (currently).

## `Add`

### Adds object to the target Collection, unless not allowed due to requirements in 7.5 (`outbox:add:adds-object-to-target`) *SHOULD*

**Status**: TODO/Incomplete.

The requirements are that the actor has to own the Collection, which we don't keep track of very well currently.

## `Remove`

### [ ] Remove object from the target Collection, unless not allowed due to requirements in 7.5 (`outbox:remove:removes-from-target`) *SHOULD*

**Status**: TODO/Incomplete.

Same as above.

## `Like`

### Adds the object to the actor's Liked Collection (`outbox:like:adds-object-to-liked`) *SHOULD*

**Status**: Complete. Tested?

All local actors get a Liked Collection and the object gets added to it.

## `Block`

### Prevent the blocked object from interacting with any object posted by the actor (`outbox:block:prevent-interaction-with-actor`) *SHOULD*

**Status**: TODO/Incomplete.

This seems like it would require changes in multiple places.

## `Undo`

### Supports the Undo activity in the client-to-server protocol (`outbox:undo`)  *NON-NORMATIVE*

**Status**: Complete? Tested?

This seems ambiguous but should be covered.

### Ensures that the actor in the activity actor is the same in activity being undone (`outbox:undo:ensures-activity-and-actor-are-same`) *MUST*

**Status**: Complete.

There is a `isActorAuthorizedToModifyObject` function.

# `Actor` object's `inbox`

## Delivery

### Performs delivery on all Activities posted to the outbox (`inbox:delivery:performs-delivery`) *MUST*

**Status**: Complete? Needs more tests.

I'm confused why this is under "Inbox" but Activities posted to the outbox do get delivered to their targets via `broadcast` method.

### "Utilizes `to`, `bto`, `cc`, and `bcc` to determine delivery recipients. (`inbox:delivery:addressing`) *MUST*

**Status**: Complete? Needs more tests.

`getRecipientsList` / `getRecipientInboxUrls` covers this.

### Provides an `id` all Activities sent to other servers, unless the activity is intentionally transient (`inbox:delivery:adds-id`) *MUST*

**Status**: Complete? Needs more tests.

The delivery package doesn't handle this, but posts to the outbox are handled.

### Dereferences delivery targets with the submitting user's credentials (`inbox:delivery:submit-with-credentials`) *MUST*

**Status**: Incomplete/TODO.

### Delivers to all items in recipients that are Collections or OrderedCollections (`inbox:delivery:deliver-to-collection`) *MUST*

**Status**: Complete. Needs more tests.

Handled in `getRecipientsList`/`getRecipientInboxUrls`

### Applies the above, recursively if the Collection contains Collections, and limits recursion depth >= 1 (`inbox:delivery:deliver-to-collection:recursively`) *MUST*

**Status**: Incomplete? Needs tests.

### Delivers activity with `object` property if the Activity `type` is one of `Create`, `Update`, `Delete`, `Follow`, `Add`, `Remove`, `Like`, `Block`, `Undo` (`inbox:delivery:delivers-with-object-for-certain-activities`) *MUST*

**Status**: Complete?

### Delivers activity with 'target' property if the Activity type is one of Add, Remove (`inbox:delivery:delivers-with-target-for-certain-activities`) *MUST*

**Status**: Complete?

### Deduplicates final recipient list (`inbox:delivery:deduplicates-final-recipient-list`) *MUST*

**Status**: Complete. Needs tests.

Uses `new Set()`.

* Does not deliver to recipients which are the same as the actor of the Activity being notified about (`inbox:delivery:do-not-deliver-to-actor`) *MUST*

**Status**: Complete. Needs tests.

* SHOULD NOT deliver Block Activities to their object (`inbox:delivery:do-not-deliver-block`) *SHOULD NOT*

**Status**: Incomplete/TODO.

### Delivers to sharedInbox endpoints to reduce the number of receiving actors delivered to by identifying all followers which share the same sharedInbox who would otherwise be individual recipients and instead deliver objects to said sharedInbox (`inbox:delivery:sharedInbox`) *MAY*

**Status**: Complete. Needs tests.

### (For servers which deliver to sharedInbox:) Deliver to actor inboxes and collections otherwise addressed which do not have a sharedInbox (`inbox:delivery:sharedInbox:deliver-to-inbox-if-no-sharedInbox`) *MUST*

**Status**: Complete. Needs tests.

## Accept

### Deduplicates activities returned by the inbox by comparing activity `id`s") (`inbox:accept:deduplicate`) *MUST*

**Status**: Incomplete/TODO?

### Forwards incoming activities to the values of to, bto, cc, bcc, audience if and only if criteria in 7.1.2 are met (`inbox:accept:special-forward`) *MUST*

**Status**: Complete? Needs tests.

Handled by `shouldForwardActivity`.

### Recurse through to, bto, cc, bcc, audience object values to determine whether/where to forward according to criteria in 7.1.2 (`inbox:accept:special-forward:recurses`) *SHOULD* 

**Status**: Incomplete/TODO? Needs tests.

### [ ] Limit recursion in this process (`inbox:accept:special-forward:limits-recursion`) *SHOULD* 

**Status**: Incomplete/TODO? Needs tests.

## `Create`

### Supports receiving a Create object in an actor's inbox (`inbox:accept:create`) *NON-NORMATIVE* 

**Status**: Complete?

## `Delete`

### Assuming object is owned by sending actor/server, removes object's representation (`inbox:accept:delete`) *SHOULD* 

**Status**: Incomplete/TODO?

No special handling for Inbox Delete currently.

### [ ] replace object's representation with a Tombstone object (`inbox:accept:delete:tombstone`) *MAY* 

**Status**: Incomplete/TODO?

No special handling for Inbox Delete currently.

## `Update`

### [ ] Take care to be sure that the Update is authorized to modify its object (`inbox:accept:update:is-authorized`) *MUST* 

**Status**: Incomplete/TODO?

No special handling for Inbox Update currently.

### Completely replace its copy of the activity with the newly received value`) (`inbox:accept:update:completely-replace`) *SHOULD* 

**Status**: Incomplete/TODO?

No special handling for Inbox Update currently.

### Don't trust content received from a server other than the content's origin without some form of verification (`inbox:accept:dont-blindly-trust`) *SHOULD* 

**Status**: Incomplete/TODO.

## `Follow` 

### Add the actor to the object user's Followers Collection (`inbox:accept:follow:add-actor-to-users-followers`) *SHOULD* 

**Status**: Complete?

### Generates either an Accept or Reject activity with Follow as object and deliver to actor of the Follow (`inbox:accept:follow:generate-accept-or-reject`) *SHOULD* 

**Status**: Complete?

### If in reply to a Follow activity, adds actor to receiver's Following Collection (`inbox:accept:accept:add-actor-to-users-following`) *SHOULD* 

**Status**: Complete?

* [ ] If in reply to a Follow activity, MUST NOT add actor to receiver's Following Collection (`inbox:accept:reject:does-not-add-actor-to-users-following`) *MUST* 

**Status**: Incomplete/TODO?

## `Add`

### Add the object to the Collection specified in the target property, unless not allowed to per requirements in 7.8 (`inbox:accept:add:to-collection`) *SHOULD* 

**Status**: Incomplete/TODO?

No special handling for Add Activity.

## `Remove`

### Remove the object from the Collection specified in the target property, unless not allowed per requirements in 7.9 (`inbox:accept:remove:from-collection`) *SHOULD* 

**Status**: Incomplete/TODO?

No special handling for Remove Activity.

## `Like`

### [ ] Perform appropriate indication of the like being performed (See 7.10 for examples) (`inbox:accept:like:indicate-like-performed`) *SHOULD* 

**Status**: Complete?

## `Announce`

### Increments object's count of shares by adding the received activity to the 'shares' collection if this collection is present (`inbox:accept:announce:add-to-shares-collection`) *SHOULD*

**Status**: Complete?

## `Undo`

### Performs Undo of object in federated context (`inbox:accept:undo`) *NON-NORMATIVE* 

**Status**: Complete?

* [ ] Validate the content they receive to avoid content spoofing attacks (`inbox:accept:validate-content`) *SHOULD* 

# Common server support

## Inbox retrieval

### Server responds to GET request at inbox URL (`server:inbox:responds-to-get`) *NON-NORMATIVE* 

**Status**: Complete.

### inbox is an OrderedCollection (`server:inbox:is-orderedcollection`) *MUST* 

**Status**: Complete.

### Server filters inbox content according to the requester's permission (`server:inbox:filtered-per-permissions`) *SHOULD* 

**Status**: Incomplete/TODO.

## Object retrieval  

### Allow dereferencing Object `id`s by responding to HTTP GET requests with a representation of the Object (`server:object-retrieval:get-id`) *MAY* 

**Status**: Unknown/Incomplete/TODO.

### Respond with the ActivityStreams object representation in response to requests that primarily Accept the media type `application/ld+json; profile=\https://www.w3.org/ns/activitystreams\` (`server:object-retrieval:respond-with-as2-re-ld-json`) *MUST* 

**Status**: Incomplete?/TODO.

### Respond with the ActivityStreams object representation in response to requests that primarily Accept the media type `application/activity+json` (`server:object-retrieval:respond-with-as2-re-activity-json`) *SHOULD* 

**Status**: Complete.

### [ ] Responds with response body that is an ActivityStreams Object of type `Tombstone` (if the server is choosing to disclose that the object has been removed)  (`server:object-retrieval:deleted-object:tombstone`) *MAY* 

**Status**: Complete?

### Respond with 410 Gone status code if Tombstone is in response body, otherwise responds with 404 Not Found (`server:object-retrieval:deleted-object:410-status`) *SHOULD* 

**Status**: Incomplete/TODO.

### [ ] Respond with 404 status code for Object URIs that have never existed (`server:object-retrieval:deleted-object:404-status`) *SHOULD* 

**Status**: Complete?

### [ ] Respond with a 403 Forbidden status code to all requests that access Objects considered Private (or 404 if the server does not want to disclose the existence of the object, or another HTTP status code if specified by the authorization method)`) (`server:object-retrieval:private-403-or-404`) *SHOULD*

**Status**: Incomplete/TODO.

## Security considerations

### [B.1](https://w3c.github.io/activitypub/#security-verification), Server verifies that the new content is really posted by the actor indicated in Objects received in inbox and outbox (`server:security-considerations:actually-posted-by-actor`) *NON-NORMATIVE*

**Status**: Incomplete/TODO?

### By default, implementation does not make HTTP requests to localhost when delivering Activities (`server:security-considerations:do-not-post-to-localhost`) *NON-NORMATIVE* 

**Status**: Incomplete/TODO?

### Implementation applies a whitelist of allowed URI protocols before issuing requests, e.g. for inbox delivery (`server:security-considerations:uri-scheme-whitelist`) *NON-NORMATIVE* 

**Status**: Incomplete/TODO?

### Server filters incoming content both by local untrusted users and any remote users through some sort of spam filter (`server:security-considerations:filter-incoming-content`) *NON-NORMATIVE* 

**Status**: Incomplete/TODO.

### Implementation takes care to sanitize fields containing markup to prevent cross site scripting attacks) (`server:security-considerations:sanitize-fields`) *NON-NORMATIVE* 

**Status**: Incomplete/TODO.