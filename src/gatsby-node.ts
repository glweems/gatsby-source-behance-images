/* eslint-disable @typescript-eslint/no-explicit-any */
import * as crypto from 'crypto';
import * as axios from 'axios';
import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';
import * as download from 'image-downloader';

const dict = (arr: any): any => {
  let idk: any[];
  idk = arr.map(([k, v]: [any, any]): any => ({ [`size_${k}`]: v }));
  let obj = {};
  Object.assign(obj, ...idk);
  return obj;
};

// Transform the sizes and dimensions properties (these have numeral keys returned by the Behance API)
const transformImage = (imageObject: any): any => ({
  ...imageObject,
  sizes: dict(Object.entries(imageObject.sizes)),
  dimensions: dict(Object.entries(imageObject.dimensions)),
});

// Transform the properties that have numbers as keys
const transformProject = (project: any): any => ({
  ...project,
  slug: project.slug.toLowerCase(),
  cover: project.covers.original,
  covers: dict(Object.entries(project.covers)),
  owners: project.owners.map((owner: any): any => ({
    ...owner,
    images: dict(Object.entries(owner.images)),
  })),
  modules: project.modules.map((module: any): any => {
    if (module.type === `image`) return transformImage(module);
    if (module.type === `media_collection`)
      return { ...module, components: module.components.map(transformImage) };
    return module;
  }),
});

interface Options {
  username: string;
  apiKey: string;
  userDir: string;
}

export const sourceNodes = async (
  { actions: { createNode }, store, createNodeId, createContentDigest, reporter }: any,
  { username, apiKey, userDir = 'public' }: Options,
): Promise<any> => {
  // Throw error if no username / apiKey
  if (!username || !apiKey) {
    return reporter.error('username & apiKey are required!');
  }

  const programDir = store.getState().program.directory;

  const shouldIWrite = (path: fs.PathLike): void => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
      reporter.log(path, `Created Directory`);
    } else {
      reporter.info(path, `Already created`);
    }
  };

  const directory = path.join(programDir, userDir, 'gatsby-source-behance-images');
  // Should I create base dir
  shouldIWrite(directory);

  const axiosClient = axios.create({
    baseURL: 'https://www.behance.net/v2/',
  });

  const rateLimit = 500;
  let lastCalled: number;

  const rateLimiter = (call: unknown): any => {
    const now = Date.now();
    if (lastCalled) {
      lastCalled += rateLimit;
      const wait = lastCalled - now;
      if (wait > 0) {
        return new Promise((resolve: any): any =>
          setTimeout((): any => resolve(call), wait),
        );
      }
    }
    lastCalled = now;
    return call;
  };

  axiosClient.interceptors.request.use(rateLimiter);

  const {
    data: { projects },
  } = await axiosClient.get(`/users/${username}/projects?api_key=${apiKey}`);

  const {
    data: { user },
  } = await axiosClient.get(`/users/${username}?api_key=${apiKey}`);

  const jsonStringUser = JSON.stringify(user);

  // Request detailed information about each project
  const requests = projects.map((project: { id: string }): any =>
    axiosClient.get(`/projects/${project.id}?api_key=${apiKey}`),
  );

  const projectsDetailed = await Bluebird.all(requests).map(({ data: { project } }: any): any =>
    transformProject(project),
  );

  const totalImages = (): number => {
    let total: number;
    total = 0;
    projectsDetailed.forEach(({ modules }: { modules: { type: string }[] }): void => {
      total += 1;
      total += modules.filter((module): {} => module.type === `image`).length;
    });
    return total;
  };

  let activity;
  // Download covers
  activity = reporter.activityTimer(`Downloading ${totalImages()} images`);

  activity.start();

  await projectsDetailed.forEach(async (project: any) => {
    shouldIWrite(path.join(directory, project.slug));
    const filePath = path.join(directory, project.slug, `cover.jpg`);

    await download.image({
      url: project.cover,
      dest: filePath,
    });
  });

  await projectsDetailed.forEach((project: any) => {
    project.modules.forEach(async (module: any, i: number) => {
      if (module.type === `image`) {
        shouldIWrite(path.join(directory, project.slug));

        const filePath = path.join(directory, project.slug, `${i}.jpg`);

        await download.image({ url: module.src, dest: filePath });
      } else {
        reporter.warn(`Module type ${module.type} cannot be downloaded`);
      }
    });
  });
  activity.end();

  // Create node for each project
  projectsDetailed.map(
    async (project: any): Promise<any> => {
      const jsonString = JSON.stringify(project);
      const dest: fs.PathLike = `${project.slug} - cover.jpg`;

      const projectListNode = {
        projectID: project.id,
        slug: project.slug,
        cover: dest,
        name: project.name,
        published: project.published_on,
        created: project.created_on,
        modified: project.modified_on,
        url: project.url,
        privacy: project.privacy,
        areas: project.fields,
        covers: project.covers,
        matureContent: project.mature_content,
        matureAccess: project.mature_access,
        owners: project.owners,
        stats: project.stats,
        conceived: project.conceived_on,
        canvasWidth: project.canvas_width,
        tags: project.tags,
        description: project.description,
        editorVersion: project.editor_version,
        allowComments: project.allow_comments,
        modules: project.modules,
        shortURL: project.short_url,
        copyright: project.copyright,
        tools: project.tools,
        styles: project.styles,
        creatorID: project.creator_id,
        children: [],
        id: project.id.toString(),
        parent: '__SOURCE__',
        internal: {
          type: 'BehanceProjects',
          contentDigest: crypto
            .createHash('md5')
            .update(jsonString)
            .digest('hex'),
        },
      };
      createNode(projectListNode);
    },
  );

  const userNode = {
    userID: user.id,
    names: {
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      displayName: user.display_name,
    },
    url: user.url,
    website: user.website,
    avatar: user.images['276'],
    company: user.company,
    place: {
      city: user.city,
      state: user.state,
      country: user.country,
      location: user.location,
    },
    areas: user.fields,
    stats: user.stats,
    links: user.links,
    sections: user.sections,
    socialMedia: user.social_links,
    children: [],
    id: user.id.toString(),
    parent: '__SOURCE__',
    internal: {
      type: 'BehanceUser',
      contentDigest: crypto
        .createHash('md5')
        .update(jsonStringUser)
        .digest('hex'),
    },
  };
  createNode(userNode);
};
