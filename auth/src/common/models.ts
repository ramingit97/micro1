interface IRepo<T> {
    find: () => Function
    findById: (id: number) => Function
    save: (data:T) => Function
    delete: (id: number) => Function
}