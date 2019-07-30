# gatsby-source-behance-images

A Gatsby source plugin for sourcing data into your Gatsby application from behance's api and downloading the images to use with gatsby-image

## Install

`npm install --save gatsby-source-behance-images`

or

`yarn add gatsby-source-behance-images`

## How to use:

```javascript
// In your gatsby-config.js
plugins: [
    {
        resolve: `gatsby-source-behance`,
        options: {
            // Visit your profile and grab the name after behance.net/<< username >>
            username: 'glweems',
            // You can get your API Key here: https://www.behance.net/dev/register
            apiKey: '<API Key>'

            // OPTIONAL
            // Set custom directory for downloaded images
            directory: 'public'
        }
    }
];
```

```graphql
# Example Query
query AllBehanceProjects {
    allBehanceProject {
        nodes {
            slug
            name
            modified_on
            description
            created_on
            copyright {
                description
            }
        }
    }
}
```

```graphql
query BehanceUserQuery {
    behanceUser {
        tags
        company
        avatar
        place {
            city
            country
            location
            state
        }
        stats {
            appreciations
            comments
            followers
            following
            team_members
            views
        }
        url
        website
        names {
            lastName
            displayName
            firstName
            username
        }
    }
}
```

```graphql
# Query images for gatsby-img
query FluidBehanceImages {
    allFile(filter: { sourceInstanceName: { eq: "behanceProject" } }) {
        edges {
            node {
                childImageSharp {
                    fixed(width: 400) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
        }
    }
}
```

```graphql
# Query project covers
query BehanceProjectCovers {
    allFile(filter: { name: { eq: "cover" }, relativeDirectory: { regex: "/gatsby-source-behance-images/" } }) {
        edges {
            node {
                name
                sourceInstanceName
                relativePath
                relativeDirectory
            }
        }
    }
}
```
