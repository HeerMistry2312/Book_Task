import { PipelineBuilder } from "../utils/pipelineBuilder";

export class CartPipelineBuilder {
  static cartPipeline(id: string): any[] {
    const builder = new PipelineBuilder()
      .match({ _id: id })
      .lookup("users", "userId", "_id", "user")
      .unwind("$user")
      .unwind("$books")
      .lookup("books", "books.book", "_id", "bookDetails")
      .unwind("$bookDetails")
      .lookup("users", "bookDetails.author", "_id", "author")
      .unwind("$author")
      .lookup("categories", "bookDetails.categories", "_id", "categoryDetails")
      .group({
        _id: "$_id",
        userName: { $first: "$user.username" },
        role: { $first: "$user.role" },
        email: { $first: "$user.email" },
        books: {
          $push: {
            book: "$bookDetails.title",
            author: "$author.username",
            category: "$categoryDetails.name",
            quantity: "$books.quantity",
            totalPrice: "$books.totalPrice",
          },
        },
        totalAmount: { $first: "$totalAmount" },
      })
      .project({
        _id: 0,
        userName: 1,
        role: 1,
        email: 1,
        books: 1,
        totalAmount: 1,
      });

    return builder.build();
  }
}
