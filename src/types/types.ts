export interface IObj {
  [k: string]: any;
}
export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export interface BusinessHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface IShop {
  _id?: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  address: string;
  phone: string;
  email: string;
  socialMedia?: SocialMedia;
  businessHours: BusinessHours;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  description?: string;
  categories: Array<string | IObj | any>;
  tags?: string[];
  isPublished: boolean;
  viewCount: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  publishedAt?: Date;
  author: string | IObj | any;
  createdAt: Date;
  updatedAt: Date;
}
