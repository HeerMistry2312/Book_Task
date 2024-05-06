
interface PaginatedResult<T> {
    data: T[];
    totalItems: number;
    totalPages: number;
}

export function paginate<T>(data: T[], page: number, limit: number): PaginatedResult<T> {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = data.slice(startIndex, endIndex);

    return {
        data: paginatedData,
        totalItems,
        totalPages
    };
}
