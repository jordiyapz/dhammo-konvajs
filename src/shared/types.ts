export interface TVisitor<E> {
  visit: (entity: E) => void;
}
