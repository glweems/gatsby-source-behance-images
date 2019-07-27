declare module 'axios'
declare module 'slugify'
declare module 'bluebird'
declare module 'request-progress'
declare module 'image-downloader'

interface Module {
  id: number;
  project_id: number;
  type: string;
  full_bleed: number;
  alignment: string;
  caption_alignment: string;
  src: string;
  sizes: Sizes;
  dimensions: Dimensions;
  width: number;
  height: number;
}
interface Sizes {
  disp: string;
  max_1240: string;
  max_1200: string;
  original: string;
}
interface Dimensions {
  disp: DispOrMax1240OrMax1200OrOriginal;
  max_1240: DispOrMax1240OrMax1200OrOriginal;
  max_1200: DispOrMax1240OrMax1200OrOriginal;
  original: DispOrMax1240OrMax1200OrOriginal;
}
interface DispOrMax1240OrMax1200OrOriginal {
  width: number;
  height: number;
}
interface RawProjects {
  projects?: (RawProject)[] | null;
  http_code: number;
}
interface RawProject {
  id: number;
  name: string;
  published_on: number;
  created_on: number;
  modified_on: number;
  url: string;
  slug: string;
  privacy: string;
  fields?: (string)[] | null;
  covers: Covers;
  mature_content: number;
  mature_access: string;
  owners?: (OwnersEntity)[] | null;
  stats: Stats;
  conceived_on: number;
  colors?: (ColorsEntity)[] | null;
  modules: Module[];
}


interface Covers {
  115: string;
  202: string;
  230: string;
  404: string;
  original: string;
  max_808: string;
  808?: string | null;
}
interface OwnersEntity {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  city: string;
  state: string;
  country: string;
  location: string;
  company: string;
  occupation: string;
  created_on: number;
  url: string;
  images: Images;
  display_name: string;
  fields?: (string)[] | null;
  has_default_image: number;
  website: string;
  banner_image_url: string;
  stats: Stats1;
}
interface Images {
  50: string;
  100: string;
  115: string;
  138: string;
  230: string;
  276: string;
}
interface Stats1 {
  followers: number;
  following: number;
  appreciations: number;
  views: number;
  comments: number;
}
interface Stats {
  views: number;
  appreciations: number;
  comments: number;
}
interface ColorsEntity {
  r: number;
  g: number;
  b: number;
}
