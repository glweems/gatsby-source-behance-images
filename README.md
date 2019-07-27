# gatsby-source-behance-images

A Gatsby source plugin for sourcing data into your Gatsby application from Facebooks graph API.

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
            username: '<< Your username >>',
            // You can get your API Key here: https://www.behance.net/dev/register
            apiKey: '<< API Key >>',
        }
    }
]
```
```graphql
# Example Query
{
    allBehanceProjects {
        edges {
            node {
                name
                projectID
                published
                created
                modified
                conceived
                url
                privacy
                areas
                tags
                description
                tools
                styles
                covers {
                    size_original
                }
                owners
                stats {
                    views
                    appreciations
                    comments
                }
                modules {
                    sizes {
                        size_original
                    }
                }
            }
        }
    }
}
```


```graphql
{
    behanceUser {
        names {
            displayName
            firstName
            lastName
            username
        }
        userID
        url
        website
        avatar
        company
        place {
            city
            state
            country
            location
        }
        areas
        stats {
            followers
            following
            appreciations
            views
            comments
            team_members
        }
        links {
            title
            url
        }
        sections
        socialMedia {
            social_id
            url
            service_name
            value
        }
    }
}
```
