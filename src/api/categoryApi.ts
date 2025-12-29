import { api } from "../lib/api-client";

export interface CreateCategoryData {
  title: string;
  description: string;
  color: string;
  image: File;
}

export interface UpdateCategoryData {
  title?: string;
  description?: string;
  color?: string;
  image?: File;
}

export interface CategoryResponse {
  id: string;
  title: string;
  description: string;
  color: string;
  image: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetCategoriesResponse {
  categories: CategoryResponse[];
  count: number;
  remaining: number;
}

export interface GetSpinnerCategoriesResponse {
  categories: CategoryResponse[];
  count: number;
  canSpin: boolean;
}

// Create Category API
export const createCategory = async (data: CreateCategoryData) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("color", data.color);
  formData.append("image", data.image);

  const response = await api.post("/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Get All Categories API
export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const response = await api.get("/categories");
  return response.data.data;
};

// Get Category by ID API
export const getCategoryById = async (id: string): Promise<CategoryResponse> => {
  const response = await api.get(`/categories/${id}`);
  return response.data.data.category;
};

// Update Category API
export const updateCategory = async (
  id: string,
  data: UpdateCategoryData
) => {
  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.color) formData.append("color", data.color);
  if (data.image) formData.append("image", data.image);

  const response = await api.put(`/categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data; 
};

// Delete Category API
export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`, {
    data: { confirm: true },
  });
  return response.data;
};

// Get Spinner Categories API (Public)
export const getSpinnerCategories = async (): Promise<GetSpinnerCategoriesResponse> => {
  const response = await api.get("/categories/spinner/all");
  return response.data.data;
};

