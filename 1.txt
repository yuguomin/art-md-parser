export const ExportInterfaceAst = {
  type: "TSInterfaceDeclaration",
  start: 7,
  end: 56,
  loc: null,
  id:{
      type: "Identifier",
      start: 17,
      end: 30,
      loc:{
          identifierName: "IGetGoldIndex",
          indent:0
      },
      name: "Guomin"
  },
  body: {
      type: "TSInterfaceBody",
      start: 31,
      end: 56,
      loc: {
          indent: 0
      },
      body:[
          {
              type: "TSPropertySignature",
              start: 35,
              end: 54,
              loc: {
                  indent: 2
              },
              key:{
                  type: "Identifier",
                  start: 35,
                  end: 45,
                  loc: {
                      identifierName: "start_time",
                      indent: 2
                  },
                  name: "start_time"
              },
              computed: false,
              typeAnnotation: {
                  type: "TSTypeAnnotation",
                  start: 45,
                  end: 53,
                  loc: {
                      indent: 2
                  },
                  typeAnnotation:{ 
                      type: "TSStringKeyword",
                      start: 47,
                      end: 53,
                      loc: {
                          indent: 2
                      }
                  }
              }
          }
      ]
  }
}