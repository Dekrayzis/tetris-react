declare module 'aphrodite' {
  export type StyleDeclarationValue = unknown;
  export type StyleDeclaration = Record<string, StyleDeclarationValue>;

  export type StyleSheetDefinition = Record<string, StyleDeclaration>;
  export type StyleSheetResult<T extends StyleSheetDefinition> = T;

  export const StyleSheet: {
    create<T extends StyleSheetDefinition>(styles: T): StyleSheetResult<T>;
  };

  export function css(...styles: Array<unknown>): string;
}
