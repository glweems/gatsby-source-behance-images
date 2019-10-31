import * as axios from 'axios';
import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';
import * as download from 'image-downloader';
import { createFileNode } from 'gatsby-source-filesystem/create-file-node';

export const sourceNodes = async (
    { actions: { createNode }, store, createNodeId, createContentDigest, reporter }: SourceNodesProps,
    {
        username,
        apiKey,
        directory = path.join(store.getState().program.directory, '.cache', 'gatsby-source-behance-images')
    }: Props
): Promise<void> => {
    // Throw error if no username / apiKey
    if (!username || !apiKey) {
        return reporter.error('username & apiKey are required!');
    }
    // Should I create base dir
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
        reporter.info(`Directory created`, directory);
    }

    const formatUser = (user: User): UserFormatted => ({
        names: {
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            displayName: user.display_name
        },
        url: user.url,
        website: user.website,
        avatar: user.images['276'],
        company: user.company,
        place: {
            city: user.city,
            state: user.state,
            country: user.country,
            location: user.location
        },
        tags: user.fields,
        stats: user.stats,
        links: user.links,
        sections: user.sections,
        socialMedia: user.social_links
    });

    const formatProjectOwners = (owners: (OwnersEntity)[] | null | undefined) =>
        owners
            ? owners.map((owner: OwnersEntity) => {
                  const image = owner.images['276'];
                  delete owner.fields;
                  return {
                      ...owner,
                      image
                  };
              })
            : null;

    const transformProjectModules = (slug: string, modules: Module[]) =>
        modules
            .filter(module => module.type === 'image')
            .map((module, i) => ({
                id: module.id,
                projectId: module.project_id,
                type: module.type,
                src: module.src,
                path: `${directory}/${slug}/${i + 1}.jpg`
            }));

    const formatProject = (project: Project) => {
        const slug = project.slug.toLowerCase();
        const cover = {
            src: project.covers.original,
            path: `${directory}/${slug}/cover.jpg`
        };
        delete project.fields;
        delete project.covers;
        return {
            ...project,
            slug,
            cover,
            owners: formatProjectOwners(project.owners),
            modules: transformProjectModules(slug, project.modules)
        };
    };

    const axiosClient = axios.create({
        baseURL: 'https://www.behance.net/v2/'
    });

    // Fetch user detauls
    const {
        data: { user }
    } = await axiosClient
        .get(`/users/${username}?api_key=${apiKey}`)
        .catch((err: Error): void => reporter.error(`Error fetching user`, new Error(err.message)));

    // List of all user projects
    // Incompleted data, used to fetch rest of data
    const {
        data: { projects }
    } = await axiosClient
        .get(`/users/${username}/projects?api_key=${apiKey}`)
        .catch((err: Error): void => reporter.error(`Error fetching projects`, new Error(err.message)));

    // Request detailed information about each project
    const requests = projects.map(
        (project: { id: string }): Promise<Project> =>
            axiosClient
                .get(`/projects/${project.id}?api_key=${apiKey}`)
                .catch((err: Error): void => reporter.error(`Error fetching project details`, new Error(err.message)))
    );

    // Await all requests then format each project
    const formattedProjects = await Bluebird.all(requests).map(
        ({ data: { project } }: { data: { project: Project } }): ProjectFormatted => formatProject(project)
    );

    const formattedUser = formatUser(user);
    const behanceID = createNodeId(`behance-user-${user.id}`);

    createNode({
        ...formattedUser,
        id: behanceID,
        internal: {
            type: 'behanceUser',
            contentDigest: createContentDigest(formattedUser)
        }
    });

    await formattedProjects.map(async (project: Project) => {
        if (!fs.existsSync(`${directory}/${project.slug}`)) {
            fs.mkdirSync(`${directory}/${project.slug}`);
        }
        const projectID = createNodeId(`behance-project-${project.slug}`);
        // Creating the project node
        await createNode({
            ...project,
            id: projectID,
            internal: {
                type: 'behanceProjects',
                contentDigest: createContentDigest(project)
            }
        });

        const createAndProcessModule = async ({ path, src }: Module) => {
            if (!fs.existsSync(path)) {
                await download.image({ url: src, dest: path });
            }

            return createFileNode(path, createNodeId, {
                project: project.slug,
                projectId: projectID
            }).then((fileNode: object) =>
                createNode(
                    {
                        ...fileNode,
                        behanceImage: true,
                        behanceProject: project.slug,
                        sourceInstanceName: 'behance'
                    },
                    { name: 'gatsby-source-filesystem' }
                )
            );
        };
        await Bluebird.all(project.modules.map(createAndProcessModule));
    });

    const createAndProcessProjectCover = async ({ slug, cover: { path, src } }: ProjectFormatted) => {
        if (!fs.existsSync(path)) {
            await download.image({ url: src, dest: path });
        }
        return createFileNode(path, createNodeId, {
            project: slug
        }).then((fileNode: object) =>
            createNode(
                {
                    ...fileNode,
                    cover: true,
                    behanceImage: true,
                    behanceProject: slug,
                    sourceInstanceName: 'behance'
                },
                { name: 'gatsby-source-filesystem' }
            )
        );
    };

    await Bluebird.all(formattedProjects.map(createAndProcessProjectCover));
};
