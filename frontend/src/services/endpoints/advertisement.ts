export const routes = {
  getID: (id: string) => `advertisement/${id}`,
  getAll: () => "advertisement",
  create: () => "advertisement",
  update: (id: string) => `advertisement/${id}`,
  duplicate: (id: string) => `advertisement/duplicate/${id}`,
  getPaginate: (page: string | number) => `advertisement/paginate/${page}`,
  upload: () => "advertisement/upload-photos",
  favorite: (id: string) => `advertisement/favorite/${id}`,
  autoComplete: (search: string) => `advertisement/auto-complete?search=${search}`,
  optionals: (vehicle_type: string) => `advertisement/optionals/${vehicle_type}`,
};
