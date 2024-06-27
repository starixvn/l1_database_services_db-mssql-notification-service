type RootCAs = string[] & { addFile: (filepath: string) => RootCAs; inject: () => RootCAs };

declare module "ssl-root-cas" {
    function create(): RootCAs;
    const rootCas: RootCAs;
}
