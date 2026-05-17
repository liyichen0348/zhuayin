import { Pet, Category, Notification } from '../types';

export const fetchPets = async (): Promise<Pet[]> => {
  const res = await fetch('/api/pets');
  if (!res.ok) throw new Error('Failed to fetch pets');
  const data = await res.json();
  return data.map((pet: any) => ({
    ...pet,
    healthStatus: pet.health_status || pet.healthStatus || [],
    adoptionFee: pet.adoption_fee || pet.adoptionFee || 0,
  }));
};

export const fetchPetById = async (id: string): Promise<Pet> => {
  const res = await fetch(`/api/pets/${id}`);
  if (!res.ok) throw new Error('Failed to fetch pet');
  const data = await res.json();
  return {
    ...data,
    healthStatus: data.health_status || data.healthStatus || [],
    adoptionFee: data.adoption_fee || data.adoptionFee || 0,
  };
};

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const fetchNotifications = async (username: string): Promise<Notification[]> => {
  const res = await fetch(`/api/my-notifications?username=${encodeURIComponent(username || '')}`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  const data = await res.json();
  return data.map((n: any) => ({
    ...n,
    petImage: n.pet_image || n.petImage,
    petImages: n.pet_images || n.petImages,
  }));
};

export const submitAdoption = async (payload: any): Promise<any> => {
  const res = await fetch('/api/adoptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to submit application');
  return res.json();
};

export const fetchAdoptions = async () => {
  const res = await fetch('/api/adoptions');
  if (!res.ok) throw new Error('Failed to fetch adoptions');
  return res.json();
};

export const updateAdoptionStatus = async (id: string, status: string) => {
  const res = await fetch(`/api/adoptions/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
};

export const fetchUsers = async () => {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const deletePet = async (id: string) => {
  const res = await fetch(`/api/pets/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete pet');
  return data;
};

export const createPet = async (payload: any) => {
  const res = await fetch('/api/pets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create pet');
  return data;
};

export const updatePet = async (id: string, payload: any) => {
  const res = await fetch(`/api/pets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update pet');
  return data;
};

export const deleteAdoption = async (id: string) => {
  const res = await fetch(`/api/adoptions/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete adoption');
  return data;
};

export const fetchMyAdoptions = async (phone: string, username: string) => {
  const res = await fetch(`/api/my-adoptions?phone=${encodeURIComponent(phone || '')}&username=${encodeURIComponent(username || '')}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch my adoptions');
  return data;
};

export const loginUser = async (payload: any) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || '登录失败');
  return data;
};

export const registerUser = async (payload: any) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || '注册失败');
  return data;
};

export const markNotificationAsRead = async (id: string) => {
  const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || '操作失败');
  return data;
};

export const markAllNotificationsAsRead = async (username: string) => {
  const res = await fetch(`/api/notifications/read-all`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || '操作失败');
  return data;
};
