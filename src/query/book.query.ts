import { Types } from "mongoose";
import { PipelineBuilder } from "../utils/imports";
export class BookPipelineBuilder {
    static getBookDetailsPipeline(
        id: string
    ): any[] {
        const builder = new PipelineBuilder()
            .match({ _id: id })
            .lookup("users", "author", "_id", "author")
            .unwind("$author")
            .lookup("categories", "categories", "_id", "categories")
            .project({
                _id:0,
                title: 1,
                author: "$author.username",
                category: "$categories.name",
                description: 1,
                price: 1,
            })


        return builder.build();
    }

    static getAllBooksPipeline(
        page: number,
        pageSize: number,
        searchQuery?: string,
        sortBy?: string,
        id? : string
    ): any[] {

        const builder = new PipelineBuilder()
            .match(id? {author: new Types.ObjectId(id)}: {})
            .lookup("users", "author", "_id", "author")
            .unwind("$author")
            .lookup("categories", "categories", "_id", "categories")
            .project({
                _id: 0,
                title: 1,
                author: "$author.username",
                category: "$categories.name",
                description: 1,
                price: 1,
            })
            .paginate(page, pageSize);

        if (searchQuery) {
            builder.match({
                $or: [
                    { title: { $regex: searchQuery, $options: "i" } },
                    { author: { $regex: searchQuery, $options: "i" } },
                    { category: { $regex: searchQuery, $options: "i" } },
                ],
            });
        }

        if (sortBy) {
            builder.sort(sortBy);
        }
        return builder.build();
    }
}