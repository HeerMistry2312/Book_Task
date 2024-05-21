import { Optional } from "sequelize";

interface BookAttributes {
    id: number;
    Bookname: string;
    author: number;
    ISBN: number;
    description: string;
    price: number;

  }
  interface BookCreationAttributes extends Optional<BookAttributes, 'id'> {}

  export {BookAttributes, BookCreationAttributes}