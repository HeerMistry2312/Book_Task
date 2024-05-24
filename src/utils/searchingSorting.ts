
export class PaginationBuilder {
    public static searchingItems(data: any[], searchQuery: string){
        const searchedData = data.filter(i =>
            i.Bookname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.categories.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.ISBN.toString().includes(searchQuery) ||
            i.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return searchedData
    }

    public static sortingItems(data: {
        Bookname: string;
        ISBN: number;
        description: string;
        price: number;
        author: any;
        categories: any;
    }[], sortBy: string, sortOrder: string){
        return data.sort((a, b) => {
            const fieldA = a[sortBy as keyof typeof a];
            const fieldB = b[sortBy as keyof typeof b];

            if (sortOrder === 'asc') {
              if (fieldA < fieldB) return -1;
              if (fieldA > fieldB) return 1;
              return 0;
            } else {
              if (fieldA > fieldB) return -1;
              if (fieldA < fieldB) return 1;
              return 0;
            }
          });
    }


    public static paginateItems(data: {
        Bookname: string;
        ISBN: number;
        description: string;
        price: number;
        author: any;
        categories: any;
    }[], offset: number, pageSize: number){
        return data.slice(offset, offset + pageSize)
    }
}