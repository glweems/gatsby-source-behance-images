declare module 'axios';
declare module 'slugify';
declare module 'bluebird';
declare module 'request-progress';
declare module 'image-downloader';
declare module 'gatsby-source-filesystem/create-file-node';

interface SourceNodesProps {
    actions: {createNode: Function};
    store: {getState: Function};
    createNodeId: Function;
    createContentDigest: Function;
    reporter: {info: Function; error: Function; activityTimer: Function};
}

interface Props {
    username: string;
    apiKey: string;
    directory: string;
}

interface CoverNode {
    cover: {
        src: string;
        path: string;
    };
}

interface User {
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
    images: {
        '50': string;
        '100': string;
        '115': string;
        '230': string;
        '138': string;
        '276': string;
    };
    display_name: string;
    fields: string[];
    has_default_image: number;
    website: string;
    banner_image_url: string;
    stats: {
        followers: number;
        following: number;
        appreciations: number;
        views: number;
        comments: number;
        team_members: boolean;
    };
    twitter: string;
    links: string[];
    sections: {};
    social_links: {
        social_id: number;
        url: string;
        service_name: string;
        value: string;
        social_network_type: string;
    }[];
    has_social_links: true;
}
interface UserFormatted {
    // id: num;
    names: {
        firstName: string;
        lastName: string;
        username: string;
        displayName: string;
    };
    url: string;
    website: string;
    avatar: string;
    company: string;
    place: {
        city: string;
        state: string;
        country: string;
        location: string;
    };
    tags: string[];
    stats: {
        followers: number;
        following: number;
        appreciations: number;
        views: number;
        comments: number;
        team_members: boolean;
    };
    links: string[];
    sections: object;
    socialMedia: {
        social_id: number;
        url: string;
        service_name: string;
        value: string;
        social_network_type: string;
    }[];
}
interface Project {
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
    canvas_width: number;
    tags?: (string)[] | null;
    description: string;
    editor_version: number;
    allow_comments: number;
    modules: (Module)[];
    short_url: string;
    copyright: Copyright;
    tools?: (ToolsEntity)[] | null;
    colors?: (ColorsEntity)[] | null;
    creator_id: number;
}

interface Covers {
    115: string;
    202: string;
    230: string;
    404: string;
    original: string;
    max_808: string;
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
interface OwnersEntityTransformed extends OwnersEntity {
    image: string;
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
    embed: string | null;
    path: string;
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
interface Copyright {
    license: string;
    description: string;
    license_id: number;
}
interface ToolsEntity {
    id: number;
    title: string;
    category: string;
    category_label: string;
    category_id: number;
    synonym: Synonym;
    approved: string;
    url: string;
}
interface Synonym {
    tag_id: number;
    synonym_id: number;
    name: string;
    title: string;
    url: string;
    download_url: string;
    gallery_url: string;
    authenticated: number;
    type: number;
    icon_url: string;
    icon_url_2x: string;
}
interface ColorsEntity {
    r: number;
    g: number;
    b: number;
}

interface Project {
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
    canvas_width: number;
    tags?: (string)[] | null;
    description: string;
    editor_version: number;
    allow_comments: number;
    modules: (Module)[];
    short_url: string;
    copyright: Copyright;
    tools?: (ToolsEntity)[] | null;
    colors?: (ColorsEntity)[] | null;
    creator_id: number;
}

interface ProjectFormatted {
    allow_comments: number;
    canvas_width: number;
    colors?: (ColorsEntity)[] | null;
    conceived_on: number;
    copyright: Copyright;
    created_on: number;
    cover: Cover;
    creator_id: number;
    description: string;
    editor_version: number;
    mature_access: string;
    mature_content: number;
    modified_on: number;
    modules?: (ModulesEntity)[] | null;
    name: string;
    owners?: (OwnersEntity)[] | null;
    url: string;
    tags?: (string)[] | null;
    tools?: (ToolsEntity)[] | null;
    slug: string;
    short_url: string;
    published_on: number;
    privacy: string;
}
interface ColorsEntity {
    b: number;
    g: number;
    r: number;
}
interface Copyright {
    description: string;
    license: string;
    license_id: number;
}
interface Cover {
    path: string;
    src: string;
}
interface ModulesEntity {
    id: number;
    path: string;
    src: string;
    projectId: number;
    type: string;
}
interface OwnersEntity {
    banner_image_url: string;
    city: string;
    company: string;
    country: string;
    created_on: number;
    website: string;
    username: string;
    url: string;
    state: string;
    occupation: string;
    location: string;
    last_name: string;
    image: string;
    id: number;
    has_default_image: number;
    display_name: string;
    first_name: string;
}
interface ToolsEntity {
    approved: string;
    category: string;
    category_id: number;
    category_label: string;
    id: number;
    synonym: Synonym;
    url: string;
    title: string;
}
interface Synonym {
    url: string;
    type: number;
    title: string;
    tag_id: number;
    synonym_id: number;
    name: string;
    icon_url_2x: string;
    icon_url: string;
    gallery_url: string;
    download_url: string;
    authenticated: number;
}
