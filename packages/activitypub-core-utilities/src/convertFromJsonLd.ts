import * as jsonld from 'jsonld';
import { ACTIVITYSTREAMS_CONTEXT } from './globals';
import { convertStringsToUrls } from './convertStringsToUrls';

declare module 'jsonld' {
  const documentLoaders: any;
}

export const convertFromJsonLd = async (entity: {
  [key: string]: unknown;
}): Promise<null | { [key: string]: unknown }> => {
  // define a mapping of context URL => context doc
const CONTEXTS = {
  "http://www.w3.org/ns/ldp": {
      "@context": {
          "ldp": "http://www.w3.org/ns/ldp#",
          "id": "@id",
          "type": "@type",
          "Container": "ldp:Container",
          "BasicContainer": "ldp:BasicContainer",
          "DirectContainer": "ldp:DirectContainer",
          "IndirectContainer": "ldp:IndirectContainer",
          "hasMemberRelation": {
              "@id": "ldp:hasMemberRelation",
              "@type": "@id"
          },
          "isMemberOfRelation": {
              "@id": "ldp:isMemberOfRelation",
              "@type": "@id"
          },
          "membershipResource": {
              "@id": "ldp:membershipResource",
              "@type": "@id"
          },
          "insertedContentRelation": {
              "@id": "ldp:insertedContentRelation",
              "@type": "@id"
          },
          "contains": {
              "@id": "ldp:contains",
              "@type": "@id"
          },
          "member": {
              "@id": "ldp:member",
              "@type": "@id"
          },
          "constrainedBy": {
              "@id": "ldp:constrainedBy",
              "@type": "@id"
          },
          "Resource": "ldp:Resource",
          "RDFSource": "ldp:RDFSource",
          "NonRDFSource": "ldp:NonRDFSource",
          "MemberSubject": "ldp:MemberSubject",
          "PreferContainment": "ldp:PreferContainment",
          "PreferMembership": "ldp:PreferMembership",
          "PreferMinimalContainer": "ldp:PreferMinimalContainer",
          "PageSortCriterion": "ldp:PageSortCriterion",
          "pageSortCriteria": {
              "@id": "ldp:pageSortCriteria",
              "@type": "@id",
              "@container": "@list"
          },
          "pageSortPredicate": {
              "@id": "ldp:pageSortPredicate",
              "@type": "@id"
          },
          "pageSortOrder": {
              "@id": "ldp:pageSortOrder",
              "@type": "@id"
          },
          "pageSortCollation": {
              "@id": "ldp:pageSortCollation",
              "@type": "@id"
          },
          "Ascending": "ldp:Ascending",
          "Descending": "ldp:Descending",
          "Page": "ldp:Page",
          "pageSequence": {
              "@id": "ldp:pageSequence",
              "@type": "@id"
          },
          "inbox": {
              "@id": "ldp:inbox",
              "@type": "@id"
          }
      }
  },
  "https://www.w3.org/ns/activitystreams": {
    "@context": {
        "@vocab": "_:",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "as": "https://www.w3.org/ns/activitystreams#",
        "ldp": "http://www.w3.org/ns/ldp#",
        "vcard": "http://www.w3.org/2006/vcard/ns#",
        "id": "@id",
        "type": "@type",
        "Accept": "as:Accept",
        "Activity": "as:Activity",
        "IntransitiveActivity": "as:IntransitiveActivity",
        "Add": "as:Add",
        "Announce": "as:Announce",
        "Application": "as:Application",
        "Arrive": "as:Arrive",
        "Article": "as:Article",
        "Audio": "as:Audio",
        "Block": "as:Block",
        "Collection": "as:Collection",
        "CollectionPage": "as:CollectionPage",
        "Relationship": "as:Relationship",
        "Create": "as:Create",
        "Delete": "as:Delete",
        "Dislike": "as:Dislike",
        "Document": "as:Document",
        "Event": "as:Event",
        "Follow": "as:Follow",
        "Flag": "as:Flag",
        "Group": "as:Group",
        "Ignore": "as:Ignore",
        "Image": "as:Image",
        "Invite": "as:Invite",
        "Join": "as:Join",
        "Leave": "as:Leave",
        "Like": "as:Like",
        "Link": "as:Link",
        "Mention": "as:Mention",
        "Note": "as:Note",
        "Object": "as:Object",
        "Offer": "as:Offer",
        "OrderedCollection": "as:OrderedCollection",
        "OrderedCollectionPage": "as:OrderedCollectionPage",
        "Organization": "as:Organization",
        "Page": "as:Page",
        "Person": "as:Person",
        "Place": "as:Place",
        "Profile": "as:Profile",
        "Question": "as:Question",
        "Reject": "as:Reject",
        "Remove": "as:Remove",
        "Service": "as:Service",
        "TentativeAccept": "as:TentativeAccept",
        "TentativeReject": "as:TentativeReject",
        "Tombstone": "as:Tombstone",
        "Undo": "as:Undo",
        "Update": "as:Update",
        "Video": "as:Video",
        "View": "as:View",
        "Listen": "as:Listen",
        "Read": "as:Read",
        "Move": "as:Move",
        "Travel": "as:Travel",
        "IsFollowing": "as:IsFollowing",
        "IsFollowedBy": "as:IsFollowedBy",
        "IsContact": "as:IsContact",
        "IsMember": "as:IsMember",
        "subject": {
            "@id": "as:subject",
            "@type": "@id"
        },
        "relationship": {
            "@id": "as:relationship",
            "@type": "@id"
        },
        "actor": {
            "@id": "as:actor",
            "@type": "@id"
        },
        "attributedTo": {
            "@id": "as:attributedTo",
            "@type": "@id"
        },
        "attachment": {
            "@id": "as:attachment",
            "@type": "@id"
        },
        "bcc": {
            "@id": "as:bcc",
            "@type": "@id"
        },
        "bto": {
            "@id": "as:bto",
            "@type": "@id"
        },
        "cc": {
            "@id": "as:cc",
            "@type": "@id"
        },
        "context": {
            "@id": "as:context",
            "@type": "@id"
        },
        "current": {
            "@id": "as:current",
            "@type": "@id"
        },
        "first": {
            "@id": "as:first",
            "@type": "@id"
        },
        "generator": {
            "@id": "as:generator",
            "@type": "@id"
        },
        "icon": {
            "@id": "as:icon",
            "@type": "@id"
        },
        "image": {
            "@id": "as:image",
            "@type": "@id"
        },
        "inReplyTo": {
            "@id": "as:inReplyTo",
            "@type": "@id"
        },
        "items": {
            "@id": "as:items",
            "@type": "@id"
        },
        "instrument": {
            "@id": "as:instrument",
            "@type": "@id"
        },
        "orderedItems": {
            "@id": "as:items",
            "@type": "@id",
            "@container": "@list"
        },
        "last": {
            "@id": "as:last",
            "@type": "@id"
        },
        "location": {
            "@id": "as:location",
            "@type": "@id"
        },
        "next": {
            "@id": "as:next",
            "@type": "@id"
        },
        "object": {
            "@id": "as:object",
            "@type": "@id"
        },
        "oneOf": {
            "@id": "as:oneOf",
            "@type": "@id"
        },
        "anyOf": {
            "@id": "as:anyOf",
            "@type": "@id"
        },
        "closed": {
            "@id": "as:closed",
            "@type": "xsd:dateTime"
        },
        "origin": {
            "@id": "as:origin",
            "@type": "@id"
        },
        "accuracy": {
            "@id": "as:accuracy",
            "@type": "xsd:float"
        },
        "prev": {
            "@id": "as:prev",
            "@type": "@id"
        },
        "preview": {
            "@id": "as:preview",
            "@type": "@id"
        },
        "replies": {
            "@id": "as:replies",
            "@type": "@id"
        },
        "result": {
            "@id": "as:result",
            "@type": "@id"
        },
        "audience": {
            "@id": "as:audience",
            "@type": "@id"
        },
        "partOf": {
            "@id": "as:partOf",
            "@type": "@id"
        },
        "tag": {
            "@id": "as:tag",
            "@type": "@id"
        },
        "target": {
            "@id": "as:target",
            "@type": "@id"
        },
        "to": {
            "@id": "as:to",
            "@type": "@id"
        },
        "url": {
            "@id": "as:url",
            "@type": "@id"
        },
        "altitude": {
            "@id": "as:altitude",
            "@type": "xsd:float"
        },
        "content": "as:content",
        "contentMap": {
            "@id": "as:content",
            "@container": "@language"
        },
        "name": "as:name",
        "nameMap": {
            "@id": "as:name",
            "@container": "@language"
        },
        "duration": {
            "@id": "as:duration",
            "@type": "xsd:duration"
        },
        "endTime": {
            "@id": "as:endTime",
            "@type": "xsd:dateTime"
        },
        "height": {
            "@id": "as:height",
            "@type": "xsd:nonNegativeInteger"
        },
        "href": {
            "@id": "as:href",
            "@type": "@id"
        },
        "hreflang": "as:hreflang",
        "latitude": {
            "@id": "as:latitude",
            "@type": "xsd:float"
        },
        "longitude": {
            "@id": "as:longitude",
            "@type": "xsd:float"
        },
        "mediaType": "as:mediaType",
        "published": {
            "@id": "as:published",
            "@type": "xsd:dateTime"
        },
        "radius": {
            "@id": "as:radius",
            "@type": "xsd:float"
        },
        "rel": "as:rel",
        "startIndex": {
            "@id": "as:startIndex",
            "@type": "xsd:nonNegativeInteger"
        },
        "startTime": {
            "@id": "as:startTime",
            "@type": "xsd:dateTime"
        },
        "summary": "as:summary",
        "summaryMap": {
            "@id": "as:summary",
            "@container": "@language"
        },
        "totalItems": {
            "@id": "as:totalItems",
            "@type": "xsd:nonNegativeInteger"
        },
        "units": "as:units",
        "updated": {
            "@id": "as:updated",
            "@type": "xsd:dateTime"
        },
        "width": {
            "@id": "as:width",
            "@type": "xsd:nonNegativeInteger"
        },
        "describes": {
            "@id": "as:describes",
            "@type": "@id"
        },
        "formerType": {
            "@id": "as:formerType",
            "@type": "@id"
        },
        "deleted": {
            "@id": "as:deleted",
            "@type": "xsd:dateTime"
        },
        "inbox": {
            "@id": "ldp:inbox",
            "@type": "@id"
        },
        "outbox": {
            "@id": "as:outbox",
            "@type": "@id"
        },
        "following": {
            "@id": "as:following",
            "@type": "@id"
        },
        "followers": {
            "@id": "as:followers",
            "@type": "@id"
        },
        "streams": {
            "@id": "as:streams",
            "@type": "@id"
        },
        "preferredUsername": "as:preferredUsername",
        "endpoints": {
            "@id": "as:endpoints",
            "@type": "@id"
        },
        "uploadMedia": {
            "@id": "as:uploadMedia",
            "@type": "@id"
        },
        "proxyUrl": {
            "@id": "as:proxyUrl",
            "@type": "@id"
        },
        "liked": {
            "@id": "as:liked",
            "@type": "@id"
        },
        "oauthAuthorizationEndpoint": {
            "@id": "as:oauthAuthorizationEndpoint",
            "@type": "@id"
        },
        "oauthTokenEndpoint": {
            "@id": "as:oauthTokenEndpoint",
            "@type": "@id"
        },
        "provideClientKey": {
            "@id": "as:provideClientKey",
            "@type": "@id"
        },
        "signClientKey": {
            "@id": "as:signClientKey",
            "@type": "@id"
        },
        "sharedInbox": {
            "@id": "as:sharedInbox",
            "@type": "@id"
        },
        "Public": {
            "@id": "as:Public",
            "@type": "@id"
        },
        "source": "as:source",
        "likes": {
            "@id": "as:likes",
            "@type": "@id"
        },
        "shares": {
            "@id": "as:shares",
            "@type": "@id"
        },
        "alsoKnownAs": {
            "@id": "as:alsoKnownAs",
            "@type": "@id"
        }
    }
  }
};

const nodeDocumentLoader = jsonld.documentLoaders.node();

const customLoader = async (url: string) => {
  if(url in CONTEXTS) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: CONTEXTS[url], // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    };
  }

  return nodeDocumentLoader(url);
};

  const result = await jsonld.compact(entity, {
    '@context': ACTIVITYSTREAMS_CONTEXT,
  }, {documentLoader: customLoader});

  if (!result) {
    return null;
  }

  const converted = convertStringsToUrls(result);

  if (!converted) {
    return null;
  }

  return converted as { [key: string]: unknown };
};
