import { PipelineBuilder } from "../utils/pipelineBuilder";

export class AdminPipelineBuilder {
  static pendinRequestPipeline(
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string
  ): any[] {
    const builder = new PipelineBuilder()
      .match({ isApproved: false })
      .project({ _id: 0, username: 1, email: 1, role: 1, isApproved: 1 })
      .paginate(page, pageSize);
    if (searchQuery) {
      builder.match({
        $or: [
          { username: { $regex: searchQuery, $options: "i" } },
          { role: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      });
    }

    if (sortBy) {
      builder.sort(sortBy);
    }
    return builder.build();
  }
}
