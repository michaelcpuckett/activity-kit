declare module 'jsonld' {
    const documentLoaders: any;
}
export declare const convertFromJsonLd: (entity: {
    [key: string]: unknown;
}) => Promise<{
    [key: string]: unknown;
}>;
