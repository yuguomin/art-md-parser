
/** 
 * 对应markdown的explain的type映射到interface body的type定义
*/
export enum TypeAnnotations {
  int = "TSNumberKeyword",
  string = "TSStringKeyword",
  boolean = "TSBooleanKeyword",
  array = "TSArrayType",
  object = "TSTypeReference"
}