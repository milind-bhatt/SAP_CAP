using { my.bookshop as db } from '../db/schema';

service CatalogService {
  entity Books as projection on db.Books;

  action orderBook(ID: Integer, quantity: Integer) returns String;
}