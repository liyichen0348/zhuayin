export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  distance: string;
  tags: string[];
  image: string;
  gender: '公' | '母';
  weight: string;
  personality: string[];
  description: string;
  healthStatus: string[];
  shelter: {
    name: string;
    type: string;
    since: string;
    image: string;
  };
  adoptionFee: number;
  status?: '审核中' | '面试中' | '已完成';
  submittedAt?: string;
  urgent?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  active?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  time: string;
  content: string;
  type: 'status' | 'message' | 'recommendation' | 'health';
  petImage?: string;
  petImages?: string[];
  unread?: boolean;
  date?: string;
}
