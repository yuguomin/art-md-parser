export const ExportInterfaceAst = {
  type: "TSInterfaceDeclaration",
  id: {
    type: "Identifier",
    name: "" // interface name
  },
  body: {
    type: "TSInterfaceBody",
    body: [
      {
        type: "TSPropertySignature",
        key: {
          type: "Identifier",
          name: "" // every key name
        },
        typeAnnotation: {
          type: "TSTypeAnnotation",
          typeAnnotation: {
            type: "", // annotation type
            elementType: {
              type: "TSTypeReference",
              typeName: {
                type: "Identifier",
                name: "" // interface anntation name
              }
            }
          }
        }
      }
    ]
  }
};
